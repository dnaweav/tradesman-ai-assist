
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RoleDetailsCardProps {
  roleTitle: string | null;
  onUpdate: (field: string, value: string) => void;
}

export function RoleDetailsCard({ 
  roleTitle, 
  onUpdate 
}: RoleDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <Label htmlFor="role_title" className="text-sm font-medium text-gray-700 mb-2 block">
        Role / Title
      </Label>
      <Input
        id="role_title"
        value={roleTitle || ''}
        onChange={(e) => onUpdate('role_title', e.target.value)}
        className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
        placeholder="Enter your role or job title"
      />
    </div>
  );
}
