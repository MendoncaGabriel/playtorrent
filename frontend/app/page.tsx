import Grid from '@/components/Grid';

interface SearchParams {
  offset?: string;
  limit?: string;
}

async function fetchData(offset?: string, limit?: string) {
  const query = new URLSearchParams();
  if (offset) query.append('offset', offset);
  if (limit) query.append('limit', limit);
  
  const res = await fetch(`http://localhost:3333?${query.toString()}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const data = await fetchData(searchParams.offset, searchParams.limit);

  return (
    <>
      home
      <Grid data={data} />
    </>
  );
}
