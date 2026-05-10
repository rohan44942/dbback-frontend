/**
 * Root Page
 *
 * Redirects to /dashboard. The middleware will bounce the user to /login
 * if they aren't authenticated.
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
