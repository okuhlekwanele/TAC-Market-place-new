import React, { useState } from 'react';
import {
  Search, Filter, Eye, Edit3, Trash2, User, Phone,
  MapPin, Clock, Award, RefreshCw, ExternalLink, Upload,
  Settings, AlertCircle, Pencil, Check, X
} from 'lucide-react';

import { useLocalProfiles, LocalProfile } from '../hooks/useLocalProfiles'; // 👈 THIS IS ESSENTIAL
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { GoogleSheetsStatus } from './GoogleSheetsStatus';
import { Pencil, Check, X } from 'lucide-react';

export function LocalProfilesTable() {
  const {
    profiles,
    updateProfile,
    deleteProfile,
    regenerateAIContent,
    loading,
  } = useLocalProfiles();

  // New local state to manage editing availability
  const [editingAvailabilityId, setEditingAvailabilityId] = useState<string | null>(null);
  const [availabilityDraft, setAvailabilityDraft] = useState<LocalProfile['availability']>([]);

  const handleEditAvailability = (profile: LocalProfile) => {
    setEditingAvailabilityId(profile.id);
    setAvailabilityDraft(profile.availability || []);
  };

  const handleAvailabilityChange = (index: number, field: keyof typeof availabilityDraft[number], value: string | boolean) => {
    const updated = [...availabilityDraft];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilityDraft(updated);
  };

  const saveAvailability = async (id: string) => {
    await updateProfile(id, { availability: availabilityDraft });
    setEditingAvailabilityId(null);
  };

  const cancelAvailabilityEdit = () => {
    setEditingAvailabilityId(null);
    setAvailabilityDraft([]);
  };

  // Inside the main JSX return, locate the profile table rows
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ... your top header, stats, etc. remain unchanged */}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                {/* ...other headers */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  {/* Profile Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{profile.fullName}</div>
                  </td>

                  {/* Availability Cell */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {editingAvailabilityId === profile.id ? (
                      <div className="space-y-2">
                        {availabilityDraft.map((slot, index) => (
                          <div key={index} className="grid grid-cols-5 gap-2">
                            <input
                              type="date"
                              value={slot.date}
                              onChange={(e) =>
                                handleAvailabilityChange(index, 'date', e.target.value)
                              }
                              className="border px-2 py-1 rounded"
                            />
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                handleAvailabilityChange(index, 'startTime', e.target.value)
                              }
                              className="border px-2 py-1 rounded"
                            />
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                handleAvailabilityChange(index, 'endTime', e.target.value)
                              }
                              className="border px-2 py-1 rounded"
                            />
                            <select
                              value={slot.available ? 'yes' : 'no'}
                              onChange={(e) =>
                                handleAvailabilityChange(index, 'available', e.target.value === 'yes')
                              }
                              className="border px-2 py-1 rounded"
                            >
                              <option value="yes">✅</option>
                              <option value="no">❌</option>
                            </select>
                            <button
                              onClick={() => {
                                const updated = [...availabilityDraft];
                                updated.splice(index, 1);
                                setAvailabilityDraft(updated);
                              }}
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            setAvailabilityDraft([
                              ...availabilityDraft,
                              { date: '', startTime: '', endTime: '', available: true },
                            ])
                          }
                          className="mt-2 text-blue-500 text-sm"
                        >
                          + Add Availability
                        </button>
                      </div>
                    ) : (
                      <div>
                        {Array.isArray(profile.availability) && profile.availability.length > 0 ? (
                          profile.availability.map((slot, i) => (
                            <div key={i}>
                              {slot.date}: {slot.startTime}–{slot.endTime}{' '}
                              ({slot.available ? '✅' : '❌'})
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">No availability</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Actions Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingAvailabilityId === profile.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveAvailability(profile.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelAvailabilityEdit}
                          className="text-gray-500 hover:text-gray-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAvailability(profile)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
