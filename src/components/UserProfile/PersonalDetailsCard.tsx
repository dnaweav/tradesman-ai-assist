
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalDetailsCardProps {
  firstName: string | null;
  lastName: string | null;
  onUpdate: (field: string, value: string) => void;
}

export function PersonalDetailsCard({ 
  firstName, 
  lastName, 
  onUpdate 
}: PersonalDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md space-y-4">
      {/* First Name */}
      <div>
        <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-2 block">
          First Name
        </Label>
        <Input
          id="first_name"
          value={firstName || ''}
          onChange={(e) => onUpdate('first_name', e.target.value)}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter your first name"
        />
      </div>

      {/* Last Name */}
      <div>
        <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-2 block">
          Last Name
        </Label>
        <Input
          id="last_name"
          value={lastName || ''}
          onChange={(e) => onUpdate('last_name', e.target.value)}
          className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
          placeholder="Enter your last name"
        />
      </div>
    </div>
  );
}
