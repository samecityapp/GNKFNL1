import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, ChevronRight, Compass } from 'lucide-react';

export const revalidate = 3600;

export default async function GuidePage() {
  const articles = await db.articles.getAllByLocation('Fethiye');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Compass className="w-4 h-4" />
              <span>Keşfetmeye Başla</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              GNK Gezi Rehberi
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Fethiye ve çevresindeki gizli cennetleri, saklı koyları ve en güzel rotaları keşfedin.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="rgb(248, 250, 252)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Henüz Rehber Yazısı Yok</h3>
              <p className="text-gray-600">Yakında harika rehberlerle burada olacağız!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {articles.map((article: any) => (
              <Link
                href={`/rehber/${article.slug}`}
                key={article.id}
                className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={article.cover_image_url || 'https://placehold.co/800x600/3b82f6/ffffff?text=GNK+Rehber'}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>8 dk</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{article.location || 'Fethiye'}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {article.meta_description}
                  </p>

                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    <span>Devamını Oku</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Daha Fazla Keşfetmeye Hazır mısınız?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Türkiye'nin en güzel destinasyonlarını, saklı cennetlerini ve yerel ipuçlarını keşfedin.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl"
          >
            Ana Sayfaya Dön
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
