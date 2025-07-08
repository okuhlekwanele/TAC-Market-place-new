import React from 'react';
import { ServiceProvider } from '../types';
import { BarChart, TrendingUp, Users, Banknote, Award } from 'lucide-react';

interface AnalyticsProps {
  providers: ServiceProvider[];
}

export function Analytics({ providers }: AnalyticsProps) {
  const stats = {
    total: providers.length,
    ready: providers.filter(p => p.status === 'Ready').length,
    published: providers.filter(p => p.status === 'Published').length,
    avgPrice: providers.length > 0 ? Math.round(providers.reduce((sum, p) => sum + p.suggestedPrice, 0) / providers.length) : 0
  };

  const serviceDistribution = providers.reduce((acc, provider) => {
    acc[provider.service] = (acc[provider.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topServices = Object.entries(serviceDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const locationDistribution = providers.reduce((acc, provider) => {
    acc[provider.location] = (acc[provider.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profiles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready to Publish</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ready}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">R{stats.avgPrice}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Services</h3>
          </div>
          <div className="space-y-4">
            {topServices.map(([service, count]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{service}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
          </div>
          <div className="space-y-4">
            {topLocations.map(([location, count]) => (
              <div key={location} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{location}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Profiles</h3>
        <div className="space-y-3">
          {providers
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5)
            .map(provider => (
              <div key={provider.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {provider.fullName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{provider.fullName}</p>
                    <p className="text-xs text-gray-500">{provider.service} • {provider.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">R{provider.suggestedPrice}</p>
                  <p className="text-xs text-gray-500">{provider.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}