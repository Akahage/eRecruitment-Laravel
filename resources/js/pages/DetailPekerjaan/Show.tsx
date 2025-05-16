import React from 'react';
import { Head } from '@inertiajs/react';
import DetailPekerjaanForm from '@/components/DetailPekerjaanForm';

interface Props {
  vacancy: {
    id: number;
    title: string;
    company: string;
    description: string;
    requirements: string[];
    benefits: string[];
  }
}

export default function Show({ vacancy }: Props) {
  return (
    <>
      <Head title={`${vacancy.title} - Detail Pekerjaan`} />
      <DetailPekerjaanForm vacancy={vacancy} />
    </>
  );
}