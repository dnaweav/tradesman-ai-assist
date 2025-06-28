
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactDetailsCardProps {
  email: string | null;
  phone: string | null;
  website: string | null;
  isAdmin: boolean;
  onUpdate: (field: string, value: string) => void;
}

export function ContactDetailsCard({ 
  email, 
  phone, 
  website, 
  isAdmin, 
  onUpdate 
}: ContactDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md space-y-4">
      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email || ''}
          onChange={(e) => onUpdate('email', e.target.value)}
          disabled={!isAdmin}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter email address"
        />
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone || ''}
          onChange={(e) => onUpdate('phone', e.target.value)}
          disabled={!isAdmin}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter phone number"
        />
      </div>

      {/* Website */}
      <div>
        <Label htmlFor="website" className="text-sm font-medium text-gray-700 mb-2 block">
          Website
        </Label>
        <Input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => onUpdate('website', e.target.value)}
          disabled={!isAdmin}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter website URL"
        />
      </div>
    </div>
  );
}
