import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const division = searchParams.get('division');
  const category = searchParams.get('category');

  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);
  console.log('Division:', division);
  console.log('Category:', category);

  const db = await connectToDatabase();
  const collection = db.collection('predectedSalesdata');

  let query: any = {};

  // Validate and construct date query if startDate and endDate are provided
  if (startDate && endDate) {
    try {
      query.Date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } catch (error) {
      console.error('Error parsing dates:', error);
      return NextResponse.json({ error: 'Invalid date format' });
    }
  }

  // Add filters for division and category, if provided
  if (division && division !== 'All divisions') {
    query.Division = division;
  }
  if (category && category !== 'All Categories') {
    query.Categories = category;
  }

  console.log('Final Query:', query);

  try {
    const data = await collection.find(query).toArray();

    if (data.length === 0) {
      console.log('No data found');
      return NextResponse.json({ message: 'No data found' });
    } else {
      console.log('Data found:', data.length, 'documents');
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return NextResponse.json({ error: 'Failed to fetch data from the database' });
  }
}
