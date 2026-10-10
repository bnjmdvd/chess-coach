import { useState } from 'react';
import { StepView, type StepResult } from './StepView';
import { gradeFrom, resolveCard, schedule, type Grade } from '../state/srs';
import { getData, logToday, update } from '../state/store';
import { unitOfLesson } from '../content';

export interface QueueSummary { total: number; firstTry: number; again: string[] }

const GRADE_TEXT: Record<Grade, string> = {
  again: 'This one comes back later today and tomorrow.',
  hard: 'Got it with some help: you\'ll see it again soon.',
  good: 'Solid: scheduled for a later review.',
  easy: 'Fast and clean: this one\'s moving into long-term memory.',
};

/**
 * Runs spaced-repetition cards. Missed cards are re-asked once at the end of the
 * queue (in-session relearning) before the session finishes.
 */
export function ExerciseQueue({ ids, title, onFinish, onExit }: {
  ids: string[];
  title: string;
  onFinish: (s: QueueSummary) => void;
  onExit: () => void;
}) {
  const [queue, setQueue] = useState(() => ids.filter((x) => resolveCard(x)));
  const [i, setI] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [again, setAgain] = useState<string[]>([]);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());
  const [lastGrade, setLastGrade] = useState<Grade | null>(null);

  const id = queue[i];
  const card = id ? resolveCard(id) : null;
  if (!card) return null;

  const onDone = (r: StepResult) => {
    const grade = gradeFrom(r);
    const isRetry = requeued.has(id) && queue.indexOf(id) !== i;
    if (!isRetry) {
      update((d) => { d.cards[id] = schedule(d.cards[id], grade); });
      logToday((l) => { l.reviews++; if (grade !== 'again') l.correct++; });
      if (grade === 'good' || grade === 'easy') setFirstTry((n) => n + 1);
    }
    let q = queue;
    if (grade === 'again' && !requeued.has(id)) {
      q = [...queue, id];
      setQueue(q);
      setRequeued(new Set(requeued).add(id));
      setAgain((a) => [...a, id]);
    }
    setLastGrade(grade);
    if (i + 1 < q.length) setI(i + 1);
    else onFinish({ total: ids.length, firstTry: firstTry + (!isRetry && (grade === 'good' || grade === 'easy') ? 1 : 0), again });
  };

  const unit = unitOfLesson.get(card.lesson.id);
  const isRetry = requeued.has(id) && queue.indexOf(id) !== i;
  return (
    <div data-card={id}>
    <StepView
      key={`${i}-${id}`}
      step={card.step}
      mode="test"
      onDone={onDone}
      header={
        <div className="step-header">
          <div className="step-header-top">
            <span className="eyebrow">{title} · {i + 1} of {queue.length}</span>
            <button className="link" onClick={onExit}>Exit</button>
          </div>
          <div className="progress"><div style={{ width: `${(i / queue.length) * 100}%` }} /></div>
          <span className="muted small">
            {isRetry ? 'Second look: you missed this one earlier. ' : ''}From <em>{card.lesson.title}</em> ({unit?.title})
            {getData().cards[id] ? '' : ' · new'}
          </span>
          {lastGrade && i > 0 && <span className="muted small grade-note">Last: {GRADE_TEXT[lastGrade]}</span>}
        </div>
      }
    />
    </div>
  );
}
