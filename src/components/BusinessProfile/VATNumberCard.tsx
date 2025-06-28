
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VATNumberCardProps {
  vatNumber: string | null;
  isAdmin: boolean;
  onUpdate: (field: string, value: string) => void;
}

export function VATNumberCard({ vatNumber, isAdmin, onUpdate }: VATNumberCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <Label htmlFor="vat_number" className="text-sm font-medium text-gray-700 mb-2 block">
        VAT Number
      </Label>
      <Input
        id="vat_number"
        value={vatNumber || ''}
        onChange={(e) => onUpdate('vat_number', e.target.value)}
        disabled={!isAdmin}
        className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
        placeholder="Enter VAT number"
      />
    </div>
  );
}
