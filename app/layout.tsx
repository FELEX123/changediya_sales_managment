import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Changediya Healthcare | Prescription delivery', description: 'Upload your prescription for pharmacist review and delivery in Savedi, Ahilya Nagar and Khedgaon.' };
export default function Layout({children}: {children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
