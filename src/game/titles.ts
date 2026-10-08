import titles from '../data/titles.json'
import type { Rng } from './rng'

/** Mad-Libs style song title: pick a template, fill each {blank} from its word list. */
export function generateTitle(r: Rng): string {
  const lists = titles.lists as Record<string, string[]>
  return r.pick(titles.templates).replace(/\{(\w+)\}/g, (_, key: string) => r.pick(lists[key] ?? ['Mystery']))
}
