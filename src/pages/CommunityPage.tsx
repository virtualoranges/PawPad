import { useEffect, useState, useRef } from 'react'
import { Heart, MessageCircle, Send, Image, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface Post {
  id: string
  user_id: string
  content?: string
  photo_url?: string
  likes_count: number
  comments_count: number
  created_at: string
  profiles?: { full_name?: string; avatar_url?: string }
  pets?: { name?: string } | null
  liked?: boolean
}

interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles?: { full_name?: string }
}

export default function CommunityPage() {
  const { user, pets } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostPet, setNewPostPet] = useState('')
  const [posting, setPosting] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadPosts()
    const interval = setInterval(loadPosts, 15000)
    return () => clearInterval(interval)
  }, [user])

  const loadPosts = async () => {
    if (!user) return
    const { data } = await supabase
      .from('community_posts')
      .select('*, profiles(full_name, avatar_url), pets(name)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (!data) return

    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id)
    const likedIds = new Set(likes?.map(l => l.post_id) || [])

    setPosts((data as unknown as Post[]).map(p => ({ ...p, liked: likedIds.has(p.id) })))
    setLoading(false)
  }

  const createPost = async () => {
    if (!user || (!newPostContent && !photoFile)) return
    setPosting(true)
    try {
      let photoUrl: string | null = null
      if (photoFile) {
        const ext = photoFile.name.split('.').pop()
        const fileName = `posts/${user.id}/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('pet-photos').upload(fileName, photoFile)
        if (!uploadErr) {
          const { data } = supabase.storage.from('pet-photos').getPublicUrl(fileName)
          photoUrl = data.publicUrl
        }
      }

      const { error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        content: newPostContent || null,
        photo_url: photoUrl,
        pet_id: newPostPet || null,
      })
      if (error) throw error

      setNewPostContent('')
      setNewPostPet('')
      setPhotoFile(null)
      setPhotoPreview(null)
      toast.success('Post shared! 🐾')
      await loadPosts()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Post failed')
    }
    setPosting(false)
  }

  const toggleLike = async (post: Post) => {
    if (!user) return
    if (post.liked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      await supabase.from('community_posts').update({ likes_count: Math.max(0, post.likes_count - 1) }).eq('id', post.id)
      setPosts(posts.map(p => p.id === post.id ? { ...p, liked: false, likes_count: Math.max(0, p.likes_count - 1) } : p))
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: user.id })
      await supabase.from('community_posts').update({ likes_count: post.likes_count + 1 }).eq('id', post.id)
      setPosts(posts.map(p => p.id === post.id ? { ...p, liked: true, likes_count: p.likes_count + 1 } : p))
    }
  }

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
      if (!comments[postId]) {
        const { data } = await supabase
          .from('post_comments')
          .select('*, profiles(full_name)')
          .eq('post_id', postId)
          .order('created_at')
        setComments(c => ({ ...c, [postId]: (data as unknown as Comment[]) ?? [] }))
      }
    }
    setExpandedComments(newExpanded)
  }

  const addComment = async (postId: string) => {
    if (!user || !commentInputs[postId]?.trim()) return
    const { data, error } = await supabase.from('post_comments').insert({
      post_id: postId,
      user_id: user.id,
      content: commentInputs[postId],
    }).select('*, profiles(full_name)').single()
    if (!error && data) {
      setComments(c => ({ ...c, [postId]: [...(c[postId] || []), data as unknown as Comment] }))
      setCommentInputs(c => ({ ...c, [postId]: '' }))
      await supabase.from('community_posts').update({ comments_count: (posts.find(p => p.id === postId)?.comments_count ?? 0) + 1 }).eq('id', postId)
      setPosts(posts.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setPhotoFile(f)
    setPhotoPreview(URL.createObjectURL(f))
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-stone-800">PetTalk 🐾</h1>
        <p className="text-stone-500 mt-1">Share moments with the community</p>
      </div>

      {/* Create post */}
      <div className="clay-card p-6 mb-6">
        <textarea
          value={newPostContent}
          onChange={e => setNewPostContent(e.target.value)}
          placeholder="Share something about your pet... 🐾"
          rows={3}
          className="clay-input resize-none mb-3"
        />
        {photoPreview && (
          <div className="relative mb-3 inline-block">
            <img src={photoPreview} alt="preview" className="w-40 h-40 object-cover rounded-xl border-2 border-orange-200" />
            <button onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center">
              <X size={12} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          {pets.length > 0 && (
            <select value={newPostPet} onChange={e => setNewPostPet(e.target.value)} className="clay-input flex-1">
              <option value="">Tag a pet</option>
              {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
          <input type="file" accept="image/*" onChange={handlePhotoSelect} ref={fileRef} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="clay-btn p-3 bg-stone-100 text-stone-600 hover:bg-orange-50">
            <Image size={20} />
          </button>
          <button onClick={createPost} disabled={posting || (!newPostContent && !photoFile)}
            className="clay-btn flex items-center gap-2 px-5 py-3 bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60">
            {posting ? 'Posting...' : <><Send size={16} /> Post</>}
          </button>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="text-center py-16 text-stone-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="clay-card p-16 text-center">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-heading text-stone-600 mb-2">No posts yet</h2>
          <p className="text-stone-400 font-body">Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="clay-card overflow-hidden">
              {/* Post header */}
              <div className="flex items-center gap-3 p-4 pb-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 border-2 border-brand-200 flex items-center justify-center text-brand-600 font-heading font-bold flex-shrink-0 overflow-hidden">
                  {post.profiles?.avatar_url ? (
                    <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (post.profiles?.full_name?.charAt(0) || '?').toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-800 text-sm">{post.profiles?.full_name || 'Pet Parent'}</p>
                  <p className="text-xs text-stone-400">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    {post.pets?.name && ` · 🐾 ${post.pets.name}`}
                  </p>
                </div>
              </div>

              {/* Content */}
              {post.content && <p className="px-4 pb-3 font-body text-stone-700">{post.content}</p>}
              {post.photo_url && (
                <div className="px-4 pb-3">
                  <img src={post.photo_url} alt="post" loading="lazy" className="w-full rounded-xl max-h-96 object-cover" />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 px-4 py-3 border-t-2 border-orange-50">
                <button onClick={() => toggleLike(post)}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${post.liked ? 'text-red-500 scale-110' : 'text-stone-400 hover:text-red-400'}`}>
                  <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
                  {post.likes_count}
                </button>
                <button onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-stone-400 hover:text-blue-500">
                  <MessageCircle size={18} />
                  {post.comments_count}
                </button>
              </div>

              {/* Comments */}
              {expandedComments.has(post.id) && (
                <div className="bg-orange-50 border-t-2 border-orange-100 p-4 space-y-3">
                  {(comments[post.id] || []).map(c => (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-200 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
                        {c.profiles?.full_name?.charAt(0) || '?'}
                      </div>
                      <div className="bg-white rounded-xl px-3 py-2 flex-1">
                        <p className="text-xs font-semibold text-stone-700">{c.profiles?.full_name}</p>
                        <p className="text-sm text-stone-600">{c.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-3">
                    <input
                      value={commentInputs[post.id] || ''}
                      onChange={e => setCommentInputs(c => ({ ...c, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                      placeholder="Add a comment..."
                      className="clay-input flex-1 py-2 text-sm"
                    />
                    <button onClick={() => addComment(post.id)} className="clay-btn px-3 py-2 bg-brand-500 text-white">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
