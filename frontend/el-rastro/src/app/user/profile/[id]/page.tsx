import { redirect } from 'next/navigation';
import Image from 'next/image'

interface UserProfileProps {
  name: string;
  bio: string;
  avatarUrl: string;
}

export default async function ProfilePageId({ params }: { params: { id: string } }) {
  const { id } = params;
  const name = "User";
  const bio = "bio";

  let apiUrl = '';
  let urlRating = '';
  if (process.env.NODE_ENV === 'development') {
    apiUrl = `http://localhost:8003/api/v1/photo/${id}`;
    urlRating = `http://localhost:8007/api/v2/users/${id}/ratings`;
  } else {
    apiUrl = `http://backend-micro-image-storage/api/v1/photo/${id}`;
  }

  try {
    const result = await fetch(apiUrl);
    const url = await result.json();
    const res = await fetch(urlRating);
    const ratings = await res.json();
    let total = 0;
    for(let i = 0; i < ratings.length; i++) {
        total += ratings[i].value;
    }
    const rating = total / ratings.length;
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <Image src={url} alt={`Photo from user ${name}`} width={200} height={200} />
            </div>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-black">{name}</h1>
            <p className="text-2m text-black">{bio}</p>
          </div>
          <div className="text-center mt-4">
            <p className="text-2m font-bold text-black">Avg. rating: {rating}</p>
          </div>
          <div className="flex justify-center mt-4">
            <a href={`/user/settings/new-photo/${id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
              Settings
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.cause?.code === "ECONNREFUSED") {
      console.error(
        "Error connecting to backend API. Is backend service working?"
      )
    }
    redirect('/');
  }
}


