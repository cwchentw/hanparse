# Korean Grammar Rules

## Punctuations

```chunkspec
<predicate>,.&type=punctuation&meaning=statement terminator
&note=Marks the end of a declarative sentence.;
<predicate>,?&type=punctuation&meaning=interrogative terminator
&note='Indicates the sentence is a question, signaling rising intonation or inquiry.';
<predicate>,!&type=punctuation&meaning=exclamative terminator
&note='Used to express strong emotion, emphasis, or exclamation at the end of a sentence.';
<clause>,','&type=punctuation&meaning=clause separator
&note='Separates clauses or items in a list, improving readability and structure.';
```

## Particles

```chunkspec
<noun>,은&type=grammar&meaning=(Topic particle)&requiresBatchim=true
&note=Used after nouns ending with a consonant to indicate the topic or contrast.;
<noun>,는&type=grammar&meaning=(Topic particle)&requiresBatchim=false
&note=Used after nouns ending with a vowel to indicate the topic or contrast.;
<noun>,이&type=grammar&meaning=(Subject particle)&requiresBatchim=true
&note=Used after nouns ending with a consonant to mark the subject of a sentence.;
<noun>,가&type=grammar&meaning=(Subject particle)&requiresBatchim=false
&note=Used after nouns ending with a vowel to mark the subject of a sentence.;
<noun>,을&type=grammar&meaning=(Object particle)&requiresBatchim=true
&note=Used after nouns ending with a consonant to mark the direct object.;
<noun>,를&type=grammar&meaning=(Object particle)&requiresBatchim=false
&note=Used after nouns ending with a vowel to mark the direct object.;
<noun>,의&type=grammar&meaning=(Possessive)
&note=Shows possession',' equivalent to ''s or ''of'' in English.;
```

```chunkspec
<noun>,에서&type=grammar&meaning=at / from
&note=Indicates the location where an action takes place or a starting point.;
<noun>,에&type=grammar&meaning=to / at / on
&note=Indicates destination',' location of existence',' or a specific time.;
<noun>,도&type=grammar&meaning=also / too
&note='Additive particle used to mean ''also'' or ''too'', often replacing subject/object particles.';
<noun>,만&type=grammar&meaning=only&note=Limiting particle used to express ''only'' or ''just''.;
<noun>,같이&type=grammar&meaning=like / together
&note=Can mean ''like/as'' when attached to a noun',' or ''together'' as an adverb.;
<noun>,이고&type=grammar&meaning=is and...
&note='Connective form of the copula (이다) used to link nouns.';
<verb|adjective>,고&type=grammar&meaning=and / then
&note=Connective ending for verbs and adjectives to link clauses.;
<verb|adjective>,다가&type=grammar&meaning=while / transition
&note=Indicates a transition from one action/state to another during the process.;
<noun>,에다가&type=grammar&meaning='onto / in addition to'
&note=Added to nouns to emphasize a location of an action or an addition to a target.;
<noun>,에게다가&type=grammar&meaning=to (someone)
&note=Emphasizes the recipient of an action for animate beings.;
<noun>,한테다가&type=grammar&meaning='to (someone, colloquial)'
&note=The colloquial version of 에게다가.;
<verb|adjective>,는 데다가&type=grammar_structure&meaning=not only... but also
&requiresBatchim=false&note=Used after verb stems without a batchim to express cumulative addition.;
<verb|adjective>,은 데다가&type=grammar_structure&meaning=not only... but also
&requiresBatchim=true&note=Used after verb stems with a batchim or in past tense.;
<noun>,인 데다가&type=grammar_structure&meaning=not only... but also
&note='Used after nouns (Noun + 이다) to indicate addition.';
<verb|adjective>,데다가&type=grammar_structure&meaning=in addition to
&note=General structure used to describe adding something to a situation.;
```

## Ending

```chunkspec
<noun>,입니다&type=grammar&meaning=Formal present tense ending&note=Used after nouns;
<verb|adjective>,니다&base=ㅂ니다&type=grammar&meaning=Formal present tense ending
&requiresBatchim=false&note='Attach to verb/adjective without final consonant.'&fusionJamo=ㅂ;
<verb|adjective>,습니다&type=grammar&meaning=Formal present tense ending
&requiresBatchim=true&note='Attach to verb/adjective with final consonant.';
<noun>,이에요&type=grammar&meaning='Informal present tense ending (polite)'
&requiresBatchim=true&note=Used after nouns ending with a consonant.;
<noun>,예요&type=grammar&meaning=Informal present tense ending (polite)
&requiresBatchim=false&note=Used after nouns ending with a vowel.;
<verb>,았습니다&type=grammar&meaning=Formal past tense ending
&note=Used after verbs ending with bright vowels (양성모음);
<verb>,습니다&base=았습니다&type=grammar&meaning=Formal past tense ending
&note=Used after verbs ending with bright vowels (양성모음)&fusionJamo=ㅏㅆ;
<verb>,었습니다&type=grammar&meaning=Formal past tense ending
&note=Used after verbs ending with dark vowels (음성모음);
<verb>,습니다&base=었습니다&type=grammar&meaning=Formal past tense ending
&note=Used after verbs ending with dark vowels (음성모음)&fusionJamo=ㅓㅆ;
<verb>,했습니다&type=grammar&meaning=Formal past tense ending&note=Used after 하다 verb;
<verb>,다&base=ㄴ다&type=grammar&meaning=Plain declarative ending used after verb stems.
&note=Attach to verb stems in plain style. The final ''ㄴ'' fuses with the stem to form ''는다''. Commonly used in written narration or plain statements.&fusionJamo=ㄴ;
<adjective>,다&type=grammar&meaning=Plain declarative ending used after adjective stems.
&note=Attach directly to adjective stems in plain style. Commonly used in written narration or plain statements.;
<noun>,과&type=grammar&meaning=and&requiresBatchim=true
&note=Used after nouns ending with a consonant to connect nouns.;
<noun>,와&type=grammar&meaning=and&requiresBatchim=false
&note=Used after nouns ending with a vowel to connect nouns.;
```
