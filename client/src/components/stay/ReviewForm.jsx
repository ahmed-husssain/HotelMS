import React, { useState } from 'react'

export default function ReviewForm({ guestName }) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState(['Suite Comfort', 'Privacy & Seclusion'])
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const toggleReviewTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    setReviewSubmitted(true)
  }

  return (
    <section className="bg-white border border-slate-200/90 rounded-[2px] p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
            03 &bull; GUEST EXPERIENCE FEEDBACK
          </span>
          <h3 className="font-serif-grand text-xl text-slate-900">
            Rate Your Stay with STAYZA
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold">
          Doc FR-56
        </span>
      </div>

      {reviewSubmitted ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[2px] text-center space-y-2">
          <span className="text-emerald-700 font-serif-grand text-2xl block">Thank You, {guestName}</span>
          <p className="text-xs text-emerald-900 leading-relaxed">
            Your feedback and 5-star rating have been recorded and shared directly with the Estate General Manager and Executive Concierge.
          </p>
          <button
            type="button"
            onClick={() => setReviewSubmitted(false)}
            className="mt-2 text-[10px] font-mono uppercase text-emerald-800 underline cursor-pointer"
          >
            Edit Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleReviewSubmit} className="space-y-5">
          {/* Interactive 5-Star Selector */}
          <div>
            <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-2">
              Overall Rating
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                  aria-label={`${star} Stars`}
                >
                  <span
                    className={`${
                      (hoverRating || rating) >= star ? 'text-amber-500' : 'text-slate-300'
                    } transition-colors`}
                  >
                    &#9733;
                  </span>
                </button>
              ))}
              <span className="ml-3 font-mono text-xs font-bold text-slate-700">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Feedback Tags */}
          <div>
            <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-2">
              Highlights of Your Stay (Select all that apply)
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Suite Comfort',
                'Privacy & Seclusion',
                'Dining & Cuisine',
                'Cedar Spa Bath',
                'Concierge Service',
                'Valet & Helipad',
              ].map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleReviewTag(tag)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-[2px] border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1.5">
              Personal Notes or Suggestions
            </label>
            <textarea
              rows="3"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="The ocean views and quiet architecture made this an unforgettable stay..."
              className="w-full p-3 bg-slate-50/70 border border-slate-300 focus:border-slate-900 text-xs text-slate-900 focus:outline-none transition-colors rounded-[2px]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-colors cursor-pointer shadow-sm active:scale-98"
          >
            Submit Guest Review &rarr;
          </button>
        </form>
      )}
    </section>
  )
}
