'use client';
import {useParams} from 'next/navigation';
import PrintView from '@/components/PrintView';

export default function Print() {
  const {id} = useParams<{id:string}>();
  return <PrintView id={id}/>;
}
