import { courses } from '@/data/courses';
import ExerciseSession from '@/components/ExerciseSession';

// Pre-render all course pages for static export (Android/iOS app)
export async function generateStaticParams() {
  return courses.map(c => ({ id: c.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <ExerciseSession id={params.id} />;
}
