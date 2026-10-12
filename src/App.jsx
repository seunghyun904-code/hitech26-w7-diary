import { useEffect, useState } from 'react'
import { createDiary, deleteDiary, listDiaries } from './api/diaries.js'

const emotions = [
  { value: 'joy', emoji: '😊', label: '기쁨' },
  { value: 'calm', emoji: '😌', label: '평온' },
  { value: 'sad', emoji: '😢', label: '슬픔' },
  { value: 'angry', emoji: '😠', label: '화남' },
  { value: 'anxious', emoji: '😰', label: '불안' },
]

const emotionByValue = Object.fromEntries(
  emotions.map((emotion) => [emotion.value, emotion]),
)

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function errorMessage(error) {
  return error instanceof Error ? error.message : '알 수 없는 오류가 발생했어요.'
}

function App() {
  const [diaries, setDiaries] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState('')
  const [content, setContent] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [loadFailed, setLoadFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [todayLabel] = useState(() => dateFormatter.format(new Date()))

  useEffect(() => {
    async function loadDiaries() {
      setLoading(true)
      try {
        const rows = await listDiaries()
        setDiaries(rows)
        setLoadFailed(false)
      } catch (loadError) {
        setError(`일기를 불러오지 못했어요. ${errorMessage(loadError)}`)
        setLoadFailed(true)
      } finally {
        setLoading(false)
      }
    }

    loadDiaries()
  }, [reloadKey])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedContent = content.trim()

    if (!selectedEmotion || !trimmedContent || saving) return

    setSaving(true)
    setError('')
    try {
      const createdDiary = await createDiary({
        content: trimmedContent,
        emotion: selectedEmotion,
      })
      setDiaries((currentDiaries) => [createdDiary, ...currentDiaries])
      setSelectedEmotion('')
      setContent('')
      setLoadFailed(false)
    } catch (saveError) {
      setError(`일기를 저장하지 못했어요. ${errorMessage(saveError)}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    setError('')
    try {
      await deleteDiary(id)
      setDiaries((currentDiaries) =>
        currentDiaries.filter((diary) => diary.id !== id),
      )
    } catch (deleteError) {
      setError(`일기를 삭제하지 못했어요. ${errorMessage(deleteError)}`)
    } finally {
      setDeletingId(null)
    }
  }

  const visibleDiaries =
    filter === 'all'
      ? diaries
      : diaries.filter((diary) => diary.emotion === filter)

  return (
    <main className="min-h-screen bg-[#fbf8f5] px-4 pb-16 text-slate-800 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between py-6 sm:py-8">
          <a className="flex items-center gap-3" href="/" aria-label="마음기록 홈">
            <span className="grid size-11 place-items-center rounded-2xl bg-rose-100 text-xl">
              🌷
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              마음기록
            </span>
          </a>
          <span className="rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-medium text-slate-500">
            오늘도 나를 돌보는 중
          </span>
        </header>

        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 px-6 py-10 sm:px-10 sm:py-12">
          <p className="mb-3 text-sm font-semibold tracking-wide text-rose-500">
            {todayLabel}
          </p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            오늘의 마음은 어땠나요?
          </h1>
          <p className="max-w-xl leading-7 text-slate-600">
            어떤 감정이든 괜찮아요. 지금의 마음을 있는 그대로 기록해 보세요.
          </p>
        </section>

        <section
          aria-labelledby="write-heading"
          className="mb-10 rounded-3xl border border-rose-100/80 bg-white p-5 shadow-[0_12px_40px_-32px_rgba(113,63,83,0.35)] sm:p-8"
        >
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-rose-400">
              나의 오늘
            </p>
            <h2 id="write-heading" className="text-xl font-bold text-slate-800">
              마음 한 조각 남기기
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset className="mb-6">
              <legend className="mb-3 text-sm font-semibold text-slate-600">
                지금 느끼는 감정을 골라주세요
              </legend>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {emotions.map((emotion) => {
                  const isSelected = selectedEmotion === emotion.value

                  return (
                    <button
                      key={emotion.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedEmotion(emotion.value)}
                      className={`flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-3 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 sm:min-h-24 sm:gap-2 ${
                        isSelected
                          ? 'border-rose-300 bg-rose-50 text-rose-700 shadow-sm'
                          : 'border-slate-100 bg-slate-50/70 text-slate-600 hover:border-rose-200 hover:bg-rose-50/60'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl" aria-hidden="true">
                        {emotion.emoji}
                      </span>
                      <span className="font-medium">{emotion.label}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <label
              className="mb-3 block text-sm font-semibold text-slate-600"
              htmlFor="diary-content"
            >
              오늘 있었던 일이나 마음을 적어보세요
            </label>
            <textarea
              id="diary-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="천천히 적어도 괜찮아요. 작은 순간도 소중한 기록이 될 거예요."
              rows={4}
              className="mb-4 w-full resize-y rounded-2xl border border-slate-200 bg-[#fdfcfa] px-4 py-3.5 leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
            />
            <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs leading-5 text-slate-400">
                감정과 내용을 모두 입력해야 저장할 수 있어요.
              </p>
              <button
                type="submit"
                disabled={saving || !selectedEmotion || !content.trim()}
                className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:cursor-not-allowed disabled:bg-rose-200 disabled:text-white/90 disabled:shadow-none"
              >
                <span aria-hidden="true">{saving ? '◌' : '♡'}</span>
                {saving ? '저장 중...' : '기록 저장하기'}
              </button>
            </div>
          </form>
        </section>

        <section aria-labelledby="list-heading">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-rose-400">
                돌아보기
              </p>
              <div className="flex items-baseline gap-2">
                <h2 id="list-heading" className="text-2xl font-bold text-slate-800">
                  나의 기록
                </h2>
                <span className="text-sm text-slate-400">
                  {diaries.length}개의 일기
                </span>
              </div>
            </div>

            <div
              aria-label="감정별 필터"
              className="flex gap-2 overflow-x-auto pb-1"
              role="group"
            >
              {[{ value: 'all', label: '전체' }, ...emotions].map((option) => {
                const isSelected = filter === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setFilter(option.value)}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 ${
                      isSelected
                        ? 'bg-slate-800 text-white'
                        : 'border border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-600'
                    }`}
                  >
                    {option.value === 'all'
                      ? option.label
                      : `${option.emoji} ${option.label}`}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-800"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setError('')}
                aria-label="오류 메시지 닫기"
                className="shrink-0 font-semibold text-rose-600 hover:text-rose-800"
              >
                닫기
              </button>
            </div>
          )}

          {loading ? (
            <div
              className="rounded-3xl border border-slate-100 bg-white px-6 py-16 text-center text-slate-500"
              role="status"
            >
              <span className="mb-3 block animate-pulse text-3xl" aria-hidden="true">
                🌱
              </span>
              일기를 불러오고 있어요...
            </div>
          ) : loadFailed ? (
            <div className="rounded-3xl border border-slate-100 bg-white px-6 py-10 text-center">
              <p className="mb-4 text-sm text-slate-500">
                기록을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.
              </p>
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setReloadKey((key) => key + 1)
                }}
                className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              >
                다시 불러오기
              </button>
            </div>
          ) : visibleDiaries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-rose-200 bg-white/70 px-6 py-14 text-center">
              <span className="mb-3 block text-4xl" aria-hidden="true">
                {filter === 'all' ? '📖' : emotionByValue[filter].emoji}
              </span>
              <p className="font-semibold text-slate-700">
                {filter === 'all'
                  ? '아직 기록이 없어요'
                  : `${emotionByValue[filter].label} 감정의 기록이 없어요`}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {filter === 'all'
                  ? '첫 번째 마음 기록을 남겨보세요.'
                  : '다른 감정 탭을 선택하거나 새 기록을 남겨보세요.'}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {visibleDiaries.map((diary) => {
                const emotion = emotionByValue[diary.emotion]

                return (
                  <li
                    key={diary.id}
                    className="group flex gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_-28px_rgba(15,23,42,0.3)] transition hover:border-rose-100 sm:gap-4 sm:p-5"
                  >
                    <span
                      className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-2xl sm:size-14 sm:text-3xl"
                      aria-label={emotion ? emotion.label : '감정'}
                      role="img"
                    >
                      {emotion?.emoji ?? '💭'}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-bold text-slate-700">
                          {emotion?.label ?? '감정'}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <time
                          className="text-xs text-slate-400"
                          dateTime={diary.created_at}
                        >
                          {dateTimeFormatter.format(new Date(diary.created_at))}
                        </time>
                      </div>
                      <p className="whitespace-pre-wrap break-words leading-7 text-slate-600">
                        {diary.content}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(diary.id)}
                      disabled={deletingId === diary.id}
                      aria-label={`${dateTimeFormatter.format(new Date(diary.created_at))} 일기 삭제`}
                      className="self-start rounded-xl p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 disabled:cursor-wait disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                    >
                      <svg
                        aria-hidden="true"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 7h12m-10 0 .7 12h6.6L16 7m-6-3h4m-3 7v5m2-5v5"
                        />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <footer className="pt-10 text-center text-xs text-slate-400">
          모든 감정은 지나가고, 기록은 나를 이해하는 작은 시작이 돼요.
        </footer>
      </div>
    </main>
  )
}

export default App
