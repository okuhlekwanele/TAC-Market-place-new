import { useState } from 'react';
import { TownshipProfile } from './useTownshipProfiles';
import { ServiceProvider } from '../types';

const SPREADSHEET_ID = '1paLi0tiSOHucsR4Ma_yrZgeoxVVKvluxjBH-ScDNjUc';
const TOWNSHIP_SHEET_NAME = 'Township Profiles';
const PROVIDERS_SHEET_NAME = 'Service Providers';

export function useGoogleSheets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeGoogleSheetsAPI = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google API key not found');
    }

    // Load Google Sheets API
    if (!window.gapi) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    await new Promise((resolve) => {
      window.gapi.load('client', resolve);
    });

    await window.gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    });
  };

  const ensureSheetExists = async (sheetName: string, headers: string[]) => {
    try {
      // Check if sheet exists
      const response = await window.gapi.client.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });

      const sheets = response.result.sheets || [];
      const sheetExists = sheets.some((sheet: any) => sheet.properties.title === sheetName);

      if (!sheetExists) {
        // Create the sheet
        await window.gapi.client.sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          resource: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }]
          }
        });

        // Add headers
        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
          valueInputOption: 'RAW',
          resource: {
            values: [headers]
          }
        });
      }
    } catch (error) {
      console.error('Error ensuring sheet exists:', error);
    }
  };

  const syncTownshipProfileToSheets = async (profile: TownshipProfile): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await initializeGoogleSheetsAPI();

      const headers = [
        'ID', 'Full Name', 'Skill', 'Years Experience', 'Location', 
        'Contact', 'Availability', 'Status', 'Bio (AI)', 'Suggested Price (ZAR)', 
        'Created At', 'Profile Image'
      ];

      await ensureSheetExists(TOWNSHIP_SHEET_NAME, headers);

      const values = [
        profile.id,
        profile.fullName,
        profile.skill,
        profile.yearsExperience.toString(),
        profile.location,
        profile.contact,
        profile.availability,
        profile.status,
        profile.bioAI || '',
        profile.suggestedPriceZAR.toString(),
        profile.createdAt.toISOString(),
        profile.profileImage ? 'Yes' : 'No'
      ];

      // Check if profile already exists
      const existingData = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${TOWNSHIP_SHEET_NAME}!A:A`,
      });

      const existingIds = existingData.result.values?.slice(1).map((row: any) => row[0]) || [];
      const existingIndex = existingIds.indexOf(profile.id);

      if (existingIndex >= 0) {
        // Update existing row
        const rowNumber = existingIndex + 2; // +1 for header, +1 for 0-based index
        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${TOWNSHIP_SHEET_NAME}!A${rowNumber}:${String.fromCharCode(64 + headers.length)}${rowNumber}`,
          valueInputOption: 'RAW',
          resource: {
            values: [values]
          }
        });
      } else {
        // Append new row
        await window.gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${TOWNSHIP_SHEET_NAME}!A:${String.fromCharCode(64 + headers.length)}`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [values]
          }
        });
      }

      return true;
    } catch (err) {
      console.error('Google Sheets sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync to Google Sheets');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const syncServiceProviderToSheets = async (provider: ServiceProvider): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await initializeGoogleSheetsAPI();

      const headers = [
        'ID', 'Full Name', 'Service', 'Years Experience', 'Location', 
        'Phone', 'Email', 'WhatsApp', 'Website', 'Generated Bio', 
        'Suggested Price', 'Status', 'Is Business Owner', 'Business Name', 
        'Business Type', 'Business Description', 'Created At'
      ];

      await ensureSheetExists(PROVIDERS_SHEET_NAME, headers);

      const values = [
        provider.id,
        provider.fullName,
        provider.service,
        provider.yearsExperience.toString(),
        provider.location,
        provider.contactDetails.phone,
        provider.contactDetails.email,
        provider.contactDetails.whatsapp || '',
        provider.contactDetails.website || '',
        provider.generatedBio,
        provider.suggestedPrice.toString(),
        provider.status,
        provider.isBusinessOwner ? 'Yes' : 'No',
        provider.businessInfo?.businessName || '',
        provider.businessInfo?.businessType || '',
        provider.businessInfo?.description || '',
        provider.createdAt.toISOString()
      ];

      // Check if provider already exists
      const existingData = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${PROVIDERS_SHEET_NAME}!A:A`,
      });

      const existingIds = existingData.result.values?.slice(1).map((row: any) => row[0]) || [];
      const existingIndex = existingIds.indexOf(provider.id);

      if (existingIndex >= 0) {
        // Update existing row
        const rowNumber = existingIndex + 2; // +1 for header, +1 for 0-based index
        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${PROVIDERS_SHEET_NAME}!A${rowNumber}:${String.fromCharCode(64 + headers.length)}${rowNumber}`,
          valueInputOption: 'RAW',
          resource: {
            values: [values]
          }
        });
      } else {
        // Append new row
        await window.gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${PROVIDERS_SHEET_NAME}!A:${String.fromCharCode(64 + headers.length)}`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [values]
          }
        });
      }

      return true;
    } catch (err) {
      console.error('Google Sheets sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync to Google Sheets');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const batchSyncTownshipProfiles = async (profiles: TownshipProfile[]): Promise<number> => {
    setLoading(true);
    setError(null);
    let successCount = 0;

    try {
      for (const profile of profiles) {
        const success = await syncTownshipProfileToSheets(profile);
        if (success) successCount++;
      }
    } catch (err) {
      console.error('Batch sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to batch sync profiles');
    } finally {
      setLoading(false);
    }

    return successCount;
  };

  const batchSyncServiceProviders = async (providers: ServiceProvider[]): Promise<number> => {
    setLoading(true);
    setError(null);
    let successCount = 0;

    try {
      for (const provider of providers) {
        const success = await syncServiceProviderToSheets(provider);
        if (success) successCount++;
      }
    } catch (err) {
      console.error('Batch sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to batch sync providers');
    } finally {
      setLoading(false);
    }

    return successCount;
  };

  return {
    syncTownshipProfileToSheets,
    syncServiceProviderToSheets,
    batchSyncTownshipProfiles,
    batchSyncServiceProviders,
    loading,
    error
  };
}

// Extend the global window object to include gapi
declare global {
  interface Window {
    gapi: any;
  }
}