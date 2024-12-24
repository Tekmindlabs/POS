-- Seed data for the POS system

-- Declare variables to hold the generated IDs
DO $$
DECLARE
    store_id UUID;
    user_id UUID;
BEGIN
    -- Insert demo store and capture the generated ID
    INSERT INTO stores (id, name, address, phone, email, timezone)
    VALUES (
      gen_random_uuid(), -- Using a generated UUID for referencing
      'Demo Store',
      '123 Main St, Demo City',
      '+1234567890',
      'demo@store.com',
      'UTC'
    )
    RETURNING id INTO store_id; -- Capture the generated store ID

    -- Insert admin user and capture the generated ID
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(), -- Generate a UUID for the user
      'admin@demo.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now()
    )
    RETURNING id INTO user_id; -- Capture the generated user ID

    -- Create admin profile
    INSERT INTO user_profiles (
      id,
      full_name,
      role,
      store_id,
      active
    ) VALUES (
      user_id, -- Use the captured user ID
      'Admin User',
      'admin',
      store_id, -- Use the captured store ID
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