import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Changediya Medical Stores | Prescription delivery', icons: { icon: '/changediya-logo.svg' }, description: 'Upload your prescription for pharmacist review and delivery in Savedi, Ahilya Nagar and Khedgaon.' };
export default function Layout({children}: {children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
