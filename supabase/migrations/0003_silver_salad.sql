-- Seed data for the POS system

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Declare variables to hold the generated IDs
DO $$
DECLARE
    store_id UUID;
    user_id UUID := '4d887508-eb73-4a21-8e50-c9f3e5e1c292'; -- Fixed UUID for predictable auth
BEGIN
    -- Insert demo store and capture the generated ID
    INSERT INTO stores (id, name, address, phone, email, timezone)
    VALUES (
      gen_random_uuid(),
      'Demo Store',
      '123 Main St, Demo City',
      '+1234567890',
      'demo@store.com',
      'UTC'
    )
    RETURNING id INTO store_id;

    -- Insert admin user with raw password (Supabase will handle hashing)
    INSERT INTO auth.users (
      id,
      email,
      raw_user_meta_data,
      created_at,
      updated_at,
      email_confirmed_at,
      confirmation_sent_at
    ) VALUES (
      user_id,
      'admin@demo.com',
      '{"provider": "email"}',
      now(),
      now(),
      now(),
      now()
    );

    -- Set the password using Supabase's internal function
    UPDATE auth.users
    SET encrypted_password = crypt('admin123', gen_salt('bf'))
    WHERE id = user_id;

    -- Create admin profile
    INSERT INTO user_profiles (
      id,
      full_name,
      role,
      store_id,
      active
    ) VALUES (
      user_id,
      'Admin User',
      'admin',
      store_id,
      true
    );

    -- Insert demo categories
    INSERT INTO categories (id, name, description)
    VALUES
      (gen_random_uuid(), 'Beverages', 'Drinks and refreshments'),
      (gen_random_uuid(), 'Food', 'Ready to eat food items'),
      (gen_random_uuid(), 'Snacks', 'Light snacks and chips');

    -- Insert demo products
    INSERT INTO products (id, name, description, sku, category_id, base_price)
    VALUES
      (gen_random_uuid(), 'Coffee', 'Hot brewed coffee', 'BEV001', (SELECT id FROM categories WHERE name = 'Beverages'), 2.99),
      (gen_random_uuid(), 'Tea', 'Assorted tea selection', 'BEV002', (SELECT id FROM categories WHERE name = 'Beverages'), 1.99),
      (gen_random_uuid(), 'Sandwich', 'Fresh sandwich', 'FOOD001', (SELECT id FROM categories WHERE name = 'Food'), 5.99),
      (gen_random_uuid(), 'Chips', 'Potato chips', 'SNACK001', (SELECT id FROM categories WHERE name = 'Snacks'), 1.49);

    -- Initialize inventory
    INSERT INTO inventory (store_id, product_id, quantity, min_quantity, max_quantity)
    VALUES
      (store_id, (SELECT id FROM products WHERE name = 'Coffee'), 100, 20, 200),
      (store_id, (SELECT id FROM products WHERE name = 'Tea'), 150, 30, 300),
      (store_id, (SELECT id FROM products WHERE name = 'Sandwich'), 50, 10, 100),
      (store_id, (SELECT id FROM products WHERE name = 'Chips'), 200, 40, 400);
END $$;