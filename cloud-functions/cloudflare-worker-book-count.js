const authors = [
  {
    name: 'Jane Austen',
    nationality: 'British',
    famousWorks: ['Pride and Prejudice', 'Sense and Sensibility', 'Emma'],
  },
  {
    name: 'George Orwell',
    nationality: 'British',
    famousWorks: ['Animal Farm', 'Nineteen Eighty-Four'],
  },
  {
    name: 'Haruki Murakami',
    nationality: 'Japanese',
    famousWorks: ['Norwegian Wood', 'Kafka on the Shore', '1Q84'],
  },
  {
    name: 'Toni Morrison',
    nationality: 'American',
    famousWorks: ['Beloved', 'Song of Solomon'],
  },
]

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    },
  })
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return jsonResponse({})
    }

    if (request.method !== 'GET') {
      return jsonResponse(
        {
          success: false,
          message: 'Only GET requests are supported.',
        },
        405,
      )
    }

    const books = authors.flatMap((author) =>
      author.famousWorks.map((title) => ({
        title,
        author: author.name,
        nationality: author.nationality,
      })),
    )

    return jsonResponse({
      success: true,
      data: {
        totalBooks: books.length,
        authorsCount: authors.length,
        books,
      },
      source: 'Cloudflare Worker cloud function',
      timestamp: new Date().toISOString(),
    })
  },
}
