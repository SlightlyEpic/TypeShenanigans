type AlphabetOrder = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'W', 'V', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

type Alphabet = AlphabetOrder[number];

// Why does this not work?
// type ArrayShift<A extends Array<infer T>> = A extends Array<infer T>
type ArrayShift<A> = A extends Array<infer T>
                        ? A extends [T, ...(infer Rest extends T[])]
                            ? Rest
                            : never
                        : never;

// Same problem here
// type TrimArrayStart<A extends Array<infer T>, O extends string> = O extends `${Alphabet}${infer RestO}`
type TrimArrayStart<A, O extends string> = O extends `${Alphabet}${infer RestO}`
                                            ? A extends Array<infer T>
                                                ? A extends [T, ...(infer Rest extends T[])]
                                                    ? TrimArrayStart<Rest, RestO>
                                                    : A
                                                : never
                                            : A;

type GetFirstLetter<S extends string> = S extends`${infer T extends Alphabet}${string}` ? T : never;
type RemoveFirstLetter<S extends string> = S extends `${Alphabet}${infer Rest extends string}` ? Rest : never;

// A < B  => -1
// A == B => 0
// A > B  => 1
type LessAlphabetHelper<
    A extends Alphabet, 
    B extends Alphabet, 
    Order
> = Order extends [infer Current extends Alphabet, ...(infer RestOrder extends Alphabet[])]
    ? B extends Current
        ? A extends Current
            ? 0
            : -1
        : A extends Current
            ? 1
            : LessAlphabetHelper<A, B, RestOrder>
    : never;

type LessAlphabet<A extends Alphabet, B extends Alphabet> = LessAlphabetHelper<A, B, AlphabetOrder>;

// A <= B => 1
// A = B  => 0
type LessEqualsString<A extends string, B extends string> = A extends ''
                                                            ? 1 
                                                            : LessAlphabet<GetFirstLetter<A>, GetFirstLetter<B>> extends 0
                                                                ? LessEqualsString<RemoveFirstLetter<A>, RemoveFirstLetter<B>>
                                                                : LessAlphabet<GetFirstLetter<A>, GetFirstLetter<B>> extends 1
                                                                    ? 1
                                                                    : 0;

type CheckSorted<A extends Array<string>> = A extends ([string] | [])
                                            ? 1
                                            : A extends [infer A0 extends string, infer A1 extends string, ...(string[])]
                                                ? LessEqualsString<A0, A1> extends 1
                                                    ? CheckSorted<ArrayShift<A>>
                                                    : 0
                                                : never;

type SortArray<A extends Array<string>> = A extends string[]
                                            ? CheckSorted<A> extends 1
                                                ? A
                                                : A extends [infer A0 extends string, infer A1 extends string, ...(infer ARest extends string[])]
                                                    ? LessEqualsString<A0, A1> extends 1
                                                        ? SortArray<[A0, ...(SortArray<[A1, ...ARest]>)]>
                                                        : SortArray<[A1, ...(SortArray<[A0, ...ARest]>)]>
                                                    : never
                                            : never;

type TestArr = ['def', 'pqr', 'xyz', 'abc', 'xya'];

type SortedArr = SortArray<TestArr>
