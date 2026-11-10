import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

export const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });
  return db;
};

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  img: string;
}

export interface Order {
  id: number;
  userId: number;
  username: string;
  address: string;
  phone: string;
  totalAmount: number;
  createdAt: string;
  status: string;
  items?: OrderItem[];
}

const initialCategories: Category[] = [
  { id: 1, name: 'Áo sơ mi' },
  { id: 2, name: 'Giày sneaker' },
  { id: 3, name: 'Balo học sinh' },
  { id: 4, name: 'Mũ thời trang' },
  { id: 5, name: 'Túi xách cao cấp' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi nam Oxford', price: 280000, img: 'hinh1.jpg', categoryId: 1 },
  { id: 2, name: 'Giày Sneaker Nike White', price: 1250000, img: 'hinh2.jpg', categoryId: 2 },
  { id: 3, name: 'Balo Laptop Chống Nước', price: 450000, img: 'hinh3.jpg', categoryId: 3 },
  { id: 4, name: 'Mũ Lưỡi Trai Sport', price: 150000, img: 'hinh4.jpg', categoryId: 4 },
  { id: 5, name: 'Túi Xách Nữ Da Thật', price: 890000, img: 'hinh1.jpg', categoryId: 5 },
  { id: 6, name: 'Áo Polo Thể Thao', price: 220000, img: 'hinh2.jpg', categoryId: 1 },
];

export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    database.transaction((tx) => {
      // 1. Categories table
      tx.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
      initialCategories.forEach((c) => {
        tx.executeSql('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [c.id, c.name]);
      });

      // 2. Products table
      tx.executeSql(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        img TEXT,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )`);
      initialProducts.forEach((p) => {
        tx.executeSql(
          'INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
          [p.id, p.name, p.price, p.img, p.categoryId]
        );
      });

      // 3. Users table
      tx.executeSql(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )`);
      tx.executeSql(
        `INSERT INTO users (username, password, role)
         SELECT 'admin', '123456', 'admin'
         WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`
      );

      // 4. Orders table
      tx.executeSql(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        username TEXT,
        address TEXT,
        phone TEXT,
        totalAmount REAL,
        createdAt TEXT,
        status TEXT
      )`);

      // 5. Order items table
      tx.executeSql(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        productId INTEGER,
        productName TEXT,
        price REAL,
        quantity INTEGER,
        img TEXT,
        FOREIGN KEY (orderId) REFERENCES orders(id)
      )`);
    },
    (err) => console.error('❌ DB Transaction error:', err),
    () => {
      console.log('✅ Buoi14 Database Initialized');
      if (onSuccess) onSuccess();
    });
  } catch (error) {
    console.error('❌ initDatabase error:', error);
  }
};

// --- Category Helpers ---
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const database = await getDb();
    const [results] = await database.executeSql('SELECT * FROM categories');
    const items: Category[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      items.push(results.rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ fetchCategories error:', error);
    return [];
  }
};

export const addCategory = async (name: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('INSERT INTO categories (name) VALUES (?)', [name]);
    return true;
  } catch (error) {
    console.error('❌ addCategory error:', error);
    return false;
  }
};

export const updateCategory = async (category: Category): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('UPDATE categories SET name = ? WHERE id = ?', [category.name, category.id]);
    return true;
  } catch (error) {
    console.error('❌ updateCategory error:', error);
    return false;
  }
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM categories WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('❌ deleteCategory error:', error);
    return false;
  }
};

// --- Product Helpers ---
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM products');
    const items: Product[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      items.push(results.rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ fetchProducts error:', error);
    return [];
  }
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM products WHERE categoryId = ?', [categoryId]);
    const items: Product[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      items.push(results.rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ fetchProductsByCategory error:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      [product.name, product.price, product.img, product.categoryId]
    );
    return true;
  } catch (error) {
    console.error('❌ addProduct error:', error);
    return false;
  }
};

export const updateProduct = async (product: Product): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?',
      [product.name, product.price, product.categoryId, product.img, product.id]
    );
    return true;
  } catch (error) {
    console.error('❌ updateProduct error:', error);
    return false;
  }
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM products WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('❌ deleteProduct error:', error);
    return false;
  }
};

// --- User Helpers ---
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM users');
    const items: User[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      items.push(results.rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ fetchUsers error:', error);
    return [];
  }
};

export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
    return true;
  } catch (error) {
    console.error('❌ addUser error:', error);
    return false;
  }
};

export const updateUser = async (user: User): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?', [
      user.username,
      user.password,
      user.role,
      user.id,
    ]);
    return true;
  } catch (error) {
    console.error('❌ updateUser error:', error);
    return false;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM users WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('❌ deleteUser error:', error);
    return false;
  }
};

export const getUserByCredentials = async (username: string, password: string): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM users WHERE username = ? AND password = ?', [
      username,
      password,
    ]);
    if (results.rows.length > 0) {
      return results.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('❌ getUserByCredentials error:', error);
    return null;
  }
};

// --- Order Helpers ---
export const createOrder = async (
  userId: number,
  username: string,
  address: string,
  phone: string,
  totalAmount: number,
  items: OrderItem[]
): Promise<boolean> => {
  try {
    const db = await getDb();
    const createdAt = new Date().toLocaleString('vi-VN');
    const [res] = await db.executeSql(
      'INSERT INTO orders (userId, username, address, phone, totalAmount, createdAt, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, username, address, phone, totalAmount, createdAt, 'Đã đặt hàng']
    );
    const orderId = res.insertId;
    for (const item of items) {
      await db.executeSql(
        'INSERT INTO order_items (orderId, productId, productName, price, quantity, img) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.productId, item.productName, item.price, item.quantity, item.img]
      );
    }
    return true;
  } catch (error) {
    console.error('❌ createOrder error:', error);
    return false;
  }
};

export const fetchOrdersByUser = async (userId: number): Promise<Order[]> => {
  try {
    const db = await getDb();
    const [resOrders] = await db.executeSql('SELECT * FROM orders WHERE userId = ? ORDER BY id DESC', [userId]);
    const orders: Order[] = [];
    for (let i = 0; i < resOrders.rows.length; i++) {
      const order = resOrders.rows.item(i);
      const [resItems] = await db.executeSql('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
      const items: OrderItem[] = [];
      for (let j = 0; j < resItems.rows.length; j++) {
        items.push(resItems.rows.item(j));
      }
      order.items = items;
      orders.push(order);
    }
    return orders;
  } catch (error) {
    console.error('❌ fetchOrdersByUser error:', error);
    return [];
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const db = await getDb();
    const [resOrders] = await db.executeSql('SELECT * FROM orders ORDER BY id DESC');
    const orders: Order[] = [];
    for (let i = 0; i < resOrders.rows.length; i++) {
      const order = resOrders.rows.item(i);
      const [resItems] = await db.executeSql('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
      const items: OrderItem[] = [];
      for (let j = 0; j < resItems.rows.length; j++) {
        items.push(resItems.rows.item(j));
      }
      order.items = items;
      orders.push(order);
    }
    return orders;
  } catch (error) {
    console.error('❌ fetchAllOrders error:', error);
    return [];
  }
};
