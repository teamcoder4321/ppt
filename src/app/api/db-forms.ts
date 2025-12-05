/*
Form submission database functions
Handles storing form data in the database
*/

import { db_init, db_query, DatabaseClient } from './db';
import * as crypto from 'crypto';

/**
 * Insert a form submission into the database
 * @param formName - Name/identifier of the form
 * @param formData - JSON data from the form
 * @returns The ID of the inserted submission
 */
export async function insertFormSubmission(
  formName: string,
  formData: Record<string, any>
): Promise<number> {
  const client = await db_init();
  
  const dbType = (process.env.DATABASE_TYPE || process.env.DB_TYPE || 'postgres').toLowerCase();
  
  let query: string;
  let params: any[];
  
  switch (dbType) {
    case 'postgres':
      query = `
        INSERT INTO form_submissions (form_name, form_data)
        VALUES ($1, $2)
        RETURNING id
      `;
      params = [formName, JSON.stringify(formData)];
      break;
      
    case 'mysql':
      query = `
        INSERT INTO form_submissions (form_name, form_data)
        VALUES (?, ?)
      `;
      params = [formName, JSON.stringify(formData)];
      break;
      
    default: // sqlite
      query = `
        INSERT INTO form_submissions (form_name, form_data)
        VALUES (?, ?)
      `;
      params = [formName, JSON.stringify(formData)];
      break;
  }
  
  const result = await db_query(client, query, params);
  
  if (dbType === 'postgres') {
    return result[0].id;
  } else if (dbType === 'mysql') {
    return (result as any).insertId;
  } else {
    // SQLite - get the last inserted row id
    const lastIdResult = await db_query(client, 'SELECT last_insert_rowid() as id', []);
    return lastIdResult[0].id;
  }
}

/**
 * Get form submissions by form name with pagination
 * @param formName - Name of the form (optional, returns all if not provided)
 * @param limit - Number of records to return
 * @param offset - Number of records to skip
 * @returns Array of form submissions
 */
export async function getFormSubmissions(
  formName?: string,
  limit: number = 50,
  offset: number = 0
): Promise<Array<{
  id: number;
  timestamp: string;
  form_name: string;
  form_data: any;
}>> {
  const client = await db_init();
  
  let query: string;
  let params: any[];
  
  if (formName) {
    query = `
      SELECT id, timestamp, form_name, form_data
      FROM form_submissions
      WHERE form_name = ?
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;
    params = [formName, limit, offset];
  } else {
    query = `
      SELECT id, timestamp, form_name, form_data
      FROM form_submissions
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;
    params = [limit, offset];
  }
  
  const result = await db_query(client, query, params);
  
  // Parse JSON data for each submission
  return result.map(row => ({
    ...row,
    form_data: typeof row.form_data === 'string' ? JSON.parse(row.form_data) : row.form_data
  }));
}

/**
 * Get a single form submission by ID
 * @param id - ID of the submission
 * @returns Form submission or null if not found
 */
export async function getFormSubmissionById(
  id: number
): Promise<{
  id: number;
  timestamp: string;
  form_name: string;
  form_data: any;
} | null> {
  const client = await db_init();
  
  const query = `
    SELECT id, timestamp, form_name, form_data
    FROM form_submissions
    WHERE id = ?
  `;
  
  const result = await db_query(client, query, [id]);
  
  if (result.length === 0) {
    return null;
  }
  
  const row = result[0];
  return {
    ...row,
    form_data: typeof row.form_data === 'string' ? JSON.parse(row.form_data) : row.form_data
  };
}

/**
 * Delete a form submission by ID
 * @param id - ID of the submission to delete
 * @returns true if deleted, false if not found
 */
export async function deleteFormSubmission(id: number): Promise<boolean> {
  const client = await db_init();
  
  const query = `
    DELETE FROM form_submissions
    WHERE id = ?
  `;
  
  const result = await db_query(client, query, [id]);
  
  // Check if a row was deleted
  if ((result as any).affectedRows !== undefined) {
    return (result as any).affectedRows > 0;
  } else if ((result as any).changes !== undefined) {
    return (result as any).changes > 0;
  }
  
  return false;
}

/**
 * Get count of form submissions by form name
 * @param formName - Name of the form (optional, returns total if not provided)
 * @returns Count of submissions
 */
export async function getFormSubmissionCount(formName?: string): Promise<number> {
  const client = await db_init();
  
  let query: string;
  let params: any[];
  
  if (formName) {
    query = `
      SELECT COUNT(*) as count
      FROM form_submissions
      WHERE form_name = ?
    `;
    params = [formName];
  } else {
    query = `
      SELECT COUNT(*) as count
      FROM form_submissions
    `;
    params = [];
  }
  
  const result = await db_query(client, query, params);
  return parseInt(result[0].count, 10);
}
