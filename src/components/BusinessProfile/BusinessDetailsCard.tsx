
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BusinessDetailsCardProps {
  businessName: string | null;
  address: string | null;
  postcode: string | null;
  isAdmin: boolean;
  onUpdate: (field: string, value: string) => void;
}

export function BusinessDetailsCard({ 
  businessName, 
  address, 
  postcode, 
  isAdmin, 
  onUpdate 
}: BusinessDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md space-y-4">
      {/* Business Name */}
      <div>
        <Label htmlFor="business_name" className="text-sm font-medium text-gray-700 mb-2 block">
          Business Name
        </Label>
        <Input
          id="business_name"
          value={businessName || ''}
          onChange={(e) => onUpdate('business_name', e.target.value)}
          disabled={!isAdmin}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter business name"
        />
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
          Address
        </Label>
        <Textarea
          id="address"
          value={address || ''}
          onChange={(e) => onUpdate('address', e.target.value)}
          disabled={!isAdmin}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out min-h-[80px]"
          placeholder="Enter business address"
        />
      </div>

      {/* Postcode */}
      <div>
        <Label htmlFor="postcode" className="text-sm font-medium text-gray-700 mb-2 block">
          Postcode
        </Label>
        <Input
          id="postcode"
          value={postcode || ''}
          onChange={(e) => onUpdate('postcode', e.target.value)}
          disabled={!isAdmin}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter postcode"
        />
      </div>
    </div>
  );
}
