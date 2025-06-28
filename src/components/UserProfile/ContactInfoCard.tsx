
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactInfoCardProps {
  email: string | null;
  phoneNumber: string | null;
  onUpdate: (field: string, value: string) => void;
}

export function ContactInfoCard({ 
  email, 
  phoneNumber, 
  onUpdate 
}: ContactInfoCardProps) {
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
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter your email address"
        />
      </div>

      {/* Phone Number */}
      <div>
        <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700 mb-2 block">
          Phone Number
        </Label>
        <Input
          id="phone_number"
          type="tel"
          value={phoneNumber || ''}
          onChange={(e) => onUpdate('phone_number', e.target.value)}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
}
