const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const sampleProducts = [
  {
    product_id: 'PROD-001',
    product_name: 'Wireless Bluetooth Headphones',
    category: 'electronics',
    brand: 'TechBrand',
    specifications: {
      color: 'black',
      battery_life: '20 hours',
      connectivity: 'Bluetooth 5.0',
      weight: '250g',
      price: 99.99
    }
  },
  {
    product_id: 'PROD-002',
    product_name: 'Gaming Laptop',
    category: 'electronics',
    brand: 'GameTech',
    specifications: {
      processor: 'Intel i7',
      ram: '16GB',
      storage: '512GB SSD',
      graphics: 'RTX 3060',
      price: 1299.99
    }
  },
  {
    product_id: 'PROD-003',
    product_name: 'Cotton T-Shirt',
    category: 'clothing',
    brand: 'FashionCo',
    specifications: {
      material: '100% Cotton',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['white', 'black', 'blue'],
      price: 19.99
    }
  },
  {
    product_id: 'PROD-004',
    product_name: 'Running Shoes',
    category: 'clothing',
    brand: 'SportWear',
    specifications: {
      material: 'Mesh and synthetic',
      sizes: [7, 8, 9, 10, 11, 12],
      colors: ['black', 'white', 'red'],
      price: 89.99
    }
  },
  {
    product_id: 'PROD-005',
    product_name: 'JavaScript: The Good Parts',
    category: 'books',
    brand: 'TechBooks',
    specifications: {
      author: 'Douglas Crockford',
      pages: 176,
      isbn: '978-0596517748',
      format: 'Paperback',
      price: 24.99
    }
  },
  {
    product_id: 'PROD-006',
    product_name: 'Clean Code',
    category: 'books',
    brand: 'DevPress',
    specifications: {
      author: 'Robert C. Martin',
      pages: 464,
      isbn: '978-0132350884',
      format: 'Hardcover',
      price: 39.99
    }
  },
  {
    product_id: 'PROD-007',
    product_name: 'Coffee Maker',
    category: 'home',
    brand: 'BrewMaster',
    specifications: {
      capacity: '12 cups',
      features: ['Programmable', 'Auto-shutoff'],
      material: 'Stainless steel',
      price: 79.99
    }
  },
  {
    product_id: 'PROD-008',
    product_name: 'Vacuum Cleaner',
    category: 'home',
    brand: 'CleanTech',
    specifications: {
      type: 'Bagless',
      power: '1200W',
      capacity: '2.5L',
      weight: '5.2kg',
      price: 149.99
    }
  },
  {
    product_id: 'PROD-009',
    product_name: 'Tennis Racket',
    category: 'sports',
    brand: 'ProSport',
    specifications: {
      weight: '300g',
      head_size: '100 sq in',
      string_pattern: '16x19',
      grip_size: '4 3/8',
      price: 129.99
    }
  },
  {
    product_id: 'PROD-010',
    product_name: 'Basketball',
    category: 'sports',
    brand: 'CourtKing',
    specifications: {
      size: 'Official',
      material: 'Composite leather',
      indoor_outdoor: 'Both',
      price: 29.99
    }
  },
  {
    product_id: 'PROD-011',
    product_name: 'Smartphone',
    category: 'electronics',
    brand: 'MobileTech',
    specifications: {
      screen_size: '6.1 inches',
      storage: '128GB',
      camera: '12MP',
      battery: '3000mAh',
      price: 699.99
    }
  },
  {
    product_id: 'PROD-012',
    product_name: 'Jeans',
    category: 'clothing',
    brand: 'DenimCo',
    specifications: {
      material: 'Denim',
      fit: 'Slim',
      sizes: [28, 30, 32, 34, 36],
      colors: ['blue', 'black'],
      price: 59.99
    }
  },
  {
    product_id: 'PROD-013',
    product_name: 'Python Programming',
    category: 'books',
    brand: 'CodeBooks',
    specifications: {
      author: 'Mark Lutz',
      pages: 1648,
      isbn: '978-1449355739',
      format: 'Paperback',
      price: 54.99
    }
  },
  {
    product_id: 'PROD-014',
    product_name: 'Blender',
    category: 'home',
    brand: 'KitchenPro',
    specifications: {
      power: '1000W',
      capacity: '1.5L',
      speeds: 10,
      material: 'Glass jar',
      price: 89.99
    }
  },
  {
    product_id: 'PROD-015',
    product_name: 'Soccer Ball',
    category: 'sports',
    brand: 'FieldMaster',
    specifications: {
      size: 5,
      material: 'Synthetic leather',
      fifa_approved: true,
      price: 24.99
    }
  },
  {
    product_id: 'PROD-016',
    product_name: 'Tablet',
    category: 'electronics',
    brand: 'TabletCorp',
    specifications: {
      screen_size: '10.1 inches',
      storage: '64GB',
      ram: '4GB',
      battery_life: '10 hours',
      price: 299.99
    }
  },
  {
    product_id: 'PROD-017',
    product_name: 'Hoodie',
    category: 'clothing',
    brand: 'ComfortWear',
    specifications: {
      material: '80% Cotton, 20% Polyester',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['gray', 'black', 'navy'],
      price: 39.99
    }
  },
  {
    product_id: 'PROD-018',
    product_name: 'Design Patterns',
    category: 'books',
    brand: 'SoftwareBooks',
    specifications: {
      author: 'Gang of Four',
      pages: 395,
      isbn: '978-0201633610',
      format: 'Hardcover',
      price: 49.99
    }
  },
  {
    product_id: 'PROD-019',
    product_name: 'Air Fryer',
    category: 'home',
    brand: 'HealthyCook',
    specifications: {
      capacity: '3.7L',
      power: '1400W',
      temperature_range: '80-200°C',
      timer: '60 minutes',
      price: 119.99
    }
  },
  {
    product_id: 'PROD-020',
    product_name: 'Yoga Mat',
    category: 'sports',
    brand: 'FlexFit',
    specifications: {
      thickness: '6mm',
      material: 'TPE',
      size: '183cm x 61cm',
      non_slip: true,
      price: 34.99
    }
  }
];

exports.handler = async (event) => {
  try {
    const timestamp = new Date().toISOString();
    
    // Add timestamps to all products
    const productsWithTimestamps = sampleProducts.map(product => ({
      ...product,
      created_at: timestamp,
      updated_at: timestamp
    }));

    // Batch write in chunks of 25 (DynamoDB limit)
    const chunks = [];
    for (let i = 0; i < productsWithTimestamps.length; i += 25) {
      chunks.push(productsWithTimestamps.slice(i, i + 25));
    }

    for (const chunk of chunks) {
      const putRequests = chunk.map(product => ({
        PutRequest: {
          Item: product
        }
      }));

      const params = {
        RequestItems: {
          [process.env.TABLE_NAME]: putRequests
        }
      };

      await docClient.send(new BatchWriteCommand(params));
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Successfully initialized ${productsWithTimestamps.length} sample products`,
        timestamp: timestamp
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {
          code: 'INITIALIZATION_ERROR',
          message: 'Failed to initialize sample data',
          timestamp: new Date().toISOString(),
        },
      }),
    };
  }
};
