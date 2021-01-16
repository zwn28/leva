/**
 * Types exposed through the public API
 *
 * @note I wanted to use the types in the *-plugin.ts files and just assemble them here,
 * but the conditional types can't be broken up into separate modules, so I opted to just
 * write all of them here.
 */
import { MergedInputWithSettings, SpecialInput, SpecialInputTypes, FolderSettings } from './'
import { BeautifyUnionType, UnionToIntersection, Join } from './utils'

export type NumberSettings = { min?: number; max?: number; step?: number }
type NumberInput = MergedInputWithSettings<number, NumberSettings>

export type Point2dArray = [number, number]
export type Point2dObject = { x: number; y: number }
export type Point2d = Point2dArray | Point2dObject
export type Point2dSettings = { x?: NumberSettings; y?: NumberSettings }
export type Point2dInput = MergedInputWithSettings<Point2d, Point2dSettings>

export type Point3dArray = [number, number, number]
export type Point3dObject = { x: number; y: number; z: number }
export type Point3d = Point3dArray | Point3dObject
export type Point3dSettings = { x?: NumberSettings; y?: NumberSettings; z?: NumberSettings }
export type Point3dInput = MergedInputWithSettings<Point3d, Point3dSettings>

export type IntervalInput = { value: [number, number]; min: number; max: number }

export type ImageInput = { image: undefined | string }

type SelectInput = { options: any[] | Record<string, any>; value?: any }

type SelectWithValueInput<T, K> = { options: T[] | Record<string, T>; value: K }
type SelectWithoutValueInput<T> = { options: T[] | Record<string, T> }

export type ColorObjectInput = { r: number; g: number; b: number; a?: number }

export type Spring = { tension: number; friction: number; mass?: number }
export type SpringSettings = { [key in keyof Spring]?: NumberSettings }
export type SpringInput = MergedInputWithSettings<Spring, SpringSettings>

type BooleanInput = boolean

type StringInput = string

export type FolderInput<Schema> = {
  type: SpecialInputTypes.FOLDER
  schema: Schema
  settings: FolderSettings
}

type SchemaItem =
  | NumberInput
  | IntervalInput
  | SpecialInput
  | Point2dInput
  | Point3dInput
  | ImageInput
  | SelectInput
  | ColorObjectInput
  | SpringInput
  | BooleanInput
  | StringInput
  | FolderInput<any>

type NotAPrimitiveType = { ____: 'NotAPrimitiveType' }

type ColorObjectRGBA = { r: number; g: number; b: number; a: number }
type ColorObjectRGB = { r: number; g: number; b: number }

type PrimitiveToValue<S> = S extends ColorObjectRGBA
  ? { r: number; g: number; b: number; a: number }
  : S extends ColorObjectRGB
  ? { r: number; g: number; b: number }
  : S extends ImageInput
  ? string | undefined
  : S extends SpringInput
  ? { tension: number; friction: number; mass: number }
  : S extends SelectWithValueInput<infer T, infer K>
  ? T | K
  : S extends SelectWithoutValueInput<infer T>
  ? T
  : S extends IntervalInput
  ? [number, number]
  : S extends Point3dObject
  ? { x: number; y: number; z: number }
  : S extends Point3dArray
  ? [number, number, number]
  : S extends Point2dObject
  ? { x: number; y: number }
  : S extends Point2dArray
  ? [number, number]
  : S extends { value: infer G }
  ? PrimitiveToValue<G>
  : S extends number
  ? number
  : S extends string
  ? string
  : S extends boolean
  ? boolean
  : NotAPrimitiveType

export type SchemaToValues<S> = BeautifyUnionType<UnionToIntersection<Leaves<S>>>

export type Schema = Record<string, SchemaItem>

export type Leaves<T, P extends string | number | symbol = ''> = {
  0: T extends { schema: infer F } ? { [K in keyof F]: Join<F, K, F[K]> } : never
  1: never
  2: { [i in P]: PrimitiveToValue<T> }
  3: { [K in keyof T]: Join<T, K, Leaves<T[K], K>> }[keyof T]
  4: ''
}[T extends FolderInput<any>
  ? 0
  : T extends SpecialInput
  ? 1
  : PrimitiveToValue<T> extends NotAPrimitiveType
  ? T extends object
    ? 3
    : 4
  : 2]
