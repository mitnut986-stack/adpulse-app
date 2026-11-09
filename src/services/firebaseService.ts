import { FirestoreProduct, UserProfile } from '../types';

export const FIREBASE_PROJECT_ID = 'nut2026-e5026';
export const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
export const FIREBASE_CONSOLE_URL = `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/firestore/databases/-default-/data/~2Fproducts~2F3GgEyjaaNWjb3Xh9TSgJ`;

interface FirestoreRawField {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
}

interface FirestoreRawDocument {
  name: string;
  fields?: Record<string, FirestoreRawField>;
  createTime?: string;
  updateTime?: string;
}

// Convert Firestore document path to document ID
function extractDocId(docName: string): string {
  const parts = docName.split('/');
  return parts[parts.length - 1];
}

// Map Firestore document to Product
function mapDocToProduct(doc: FirestoreRawDocument): FirestoreProduct {
  const fields = doc.fields || {};
  const id = extractDocId(doc.name);
  const name = fields.name?.stringValue || 'Unnamed Product';
  
  let price = 0;
  if (fields.price?.doubleValue !== undefined) {
    price = Number(fields.price.doubleValue);
  } else if (fields.price?.integerValue !== undefined) {
    price = Number(fields.price.integerValue);
  }

  return {
    id,
    name,
    price,
    createTime: doc.createTime,
    updateTime: doc.updateTime,
  };
}

/**
 * Fetch all products from Firestore
 */
export async function getFirestoreProducts(): Promise<FirestoreProduct[]> {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const data: { documents?: FirestoreRawDocument[] } = await res.json();
    if (!data.documents) return [];

    return data.documents.map(mapDocToProduct);
  } catch (error) {
    console.error('Error fetching Firestore products:', error);
    throw error;
  }
}

/**
 * Create a new product in Firestore
 */
export async function createFirestoreProduct(name: string, price: number): Promise<FirestoreProduct> {
  try {
    const payload = {
      fields: {
        name: {
          stringValue: name.trim(),
        },
        price: {
          doubleValue: Number(price),
        },
      },
    };

    const res = await fetch(`${FIRESTORE_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create product: ${errText}`);
    }

    const doc: FirestoreRawDocument = await res.json();
    return mapDocToProduct(doc);
  } catch (error) {
    console.error('Error creating Firestore product:', error);
    throw error;
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteFirestoreProduct(docId: string): Promise<void> {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/products/${encodeURIComponent(docId)}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to delete product: ${errText}`);
    }
  } catch (error) {
    console.error('Error deleting Firestore product:', error);
    throw error;
  }
}

/**
 * Save user profile to Firestore
 */
export async function saveUserToFirestore(
  user: UserProfile,
  password?: string
): Promise<void> {
  try {
    const safeDocId = user.email.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const payload = {
      fields: {
        name: { stringValue: user.name },
        email: { stringValue: user.email },
        role: { stringValue: user.role },
        publisherId: { stringValue: user.publisherId },
        website: { stringValue: user.website || '' },
        password: password ? { stringValue: password } : undefined,
      },
    };

    // Filter out undefined fields
    if (!password) {
      delete (payload.fields as any).password;
    }

    const res = await fetch(
      `${FIRESTORE_BASE_URL}/users?documentId=${encodeURIComponent(safeDocId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    // If it already exists (409 conflict), update via PATCH
    if (res.status === 409) {
      await fetch(`${FIRESTORE_BASE_URL}/users/${encodeURIComponent(safeDocId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }
  } catch (error) {
    console.warn('Note: Could not sync user to Firestore:', error);
  }
}

/**
 * Lookup user in Firestore by email
 */
export async function findUserInFirestore(
  email: string
): Promise<(UserProfile & { password?: string }) | null> {
  try {
    const safeDocId = email.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const res = await fetch(`${FIRESTORE_BASE_URL}/users/${encodeURIComponent(safeDocId)}`);
    if (!res.ok) return null;

    const doc: FirestoreRawDocument = await res.json();
    const fields = doc.fields || {};

    return {
      name: fields.name?.stringValue || email.split('@')[0],
      email: fields.email?.stringValue || email,
      role: fields.role?.stringValue || 'Verified Web Publisher',
      publisherId: fields.publisherId?.stringValue || `pub-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      website: fields.website?.stringValue || 'techpulse-daily.com',
      password: fields.password?.stringValue,
    };
  } catch (error) {
    console.warn('Could not query user in Firestore:', error);
    return null;
  }
}
