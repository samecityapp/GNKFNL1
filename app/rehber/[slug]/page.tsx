import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

type Props = { params: { slug: string } };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await db.articles.getBySlug(params.slug);
  if (!article) {
    return {
      title: 'Yazı Bulunamadı | GNK',
      description: 'Aradığınız rehber yazısı sistemimizde mevcut değil.',
    };
  }

  return {
    title: `${article.title} | GNK Rehber`,
    description: article.meta_description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await db.articles.getBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.published_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/rehber"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Tüm Rehberlere Dön
        </Link>

        <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative w-full h-[400px] md:h-[500px]">
            <Image
              src={article.cover_image_url || 'https://placehold.co/1200x600/3b82f6/ffffff?text=GNK+Rehber'}
              alt={article.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span>{article.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span>{publishedDate}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>8 dakika okuma</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {article.title}
              </h1>
            </div>
          </div>

          <div className="p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed mb-12 font-medium border-l-4 border-blue-500 pl-6 italic">
                {article.meta_description}
              </p>

              <div
                className="article-content prose prose-lg md:prose-xl max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-12 prose-headings:mb-6
                  prose-h2:text-3xl prose-h2:border-b-2 prose-h2:border-blue-100 prose-h2:pb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                  prose-strong:text-blue-700 prose-strong:font-semibold
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                  prose-ul:my-6 prose-li:my-2
                "
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 md:p-12 border-t border-gray-100">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Bu rehber işinize yaradı mı?
              </h3>
              <p className="text-gray-600 mb-6">
                {article.location} bölgesindeki daha fazla gizli cenneti keşfetmek için diğer rehberlerimize göz atın.
              </p>
              <Link
                href="/rehber"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Tüm Rehberleri Keşfet
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
