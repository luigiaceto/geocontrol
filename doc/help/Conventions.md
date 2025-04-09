# Conventions Gestione Progetto e Repository

In questa Issue andrò a descrivere una serie di Conventions che credo dovremmo adottare per la gestione del Repository e del progetto in generale. Queste Conventions sono per la maggioranza quelle indicate durante le lezioni, le restanti derivano comunque dalle Best Practices e aiutano nel managing dei Repositories Git.

Scrivete commenti e/o utilizzare i tasti di Upvote e Downvote per darmi feedback. Possiamo discutere su alcune Conventions per decidere di cambiarle.


### Branch

Come indicato nelle Best Practices, le modifiche non dovrebbero essere eseguite direttamente su un Branch principale, piuttosto va creato un Branch Effimero apposito.
Per cui i Branch andrebbero creati e chiusi ad ogni modica (ovviamente, una "modifica" può comprendere più commit).

I Branch devono avere la seguente Naming Convention: `<branch tag>/#<issueID>-<breve-desc>`
- `branch tag`: è spiegato in seguito
- `issueID`: è il numero della Issue a cui fa riferimento la Merge Request che questo Branch deve risolvere
- `breve-desc`: descrizione telegrafica. Stile: `snake-case`

Se si tratta di una qualche modifica senza una corrispettiva Issue associata, omettere il pezzo `#<issueID>-` dal nome.

I _Branch Tag_ sono dei prefissi utilizzati per meglio specificare i Ephemeral Branch (Branch Effimeri) Branch Tag:

| Tag     | Persistent Branch di Riferimento |
| :-----  | :------------------------------- |
| feature | dev                              |
| hotfix  | main                             |
| bugfix  | QA                               |
| req     | requirements                     |


_Esempi Nomi Branch:_

`req/#2-update-requirements` <br><br>
`dev/#543-impl-sensor` <br><br>
`hotfix/#13-fix-rest-module`


### Commit

Come indicato dalle Best Practices, le commit non dovrebbero essere "orfane" ma dovrebbero sempre essere relative a un Branch e la relativa Merge Request. Per cui ad ogni modifica da eseguire va creato un nuovo Branch e (magari solo per le modifiche più grosse) una Merge Request.

I messaggi di commit devono rispettare la seguente convenzione:

```
<type>[ (optional branch tag)]: <Description>

[Optional Body]
```

Dove:
- `type`: è uno dei seguenti:
  - `Fix`: (si sta fixando qualcosa)
  - `Add`: (si sta aggiungendo qualcosa)
  - `Update`: (si sta cambiando qualcosa)
  - `Remove`: (si sta rimuovendo qualcosa)
  - `Refactor`: (si sta rifattorizzando qualcosa)
- `(optional branch tag)`: ridondante rispetto al Branch corrente, meglio non inserirlo mai
- `Description`: descrizione breve
- `Optional Body`: descrizione lunga nel caso di Commit che la richiedono (ricordare di lasciare una linea vuota sopra)


_Esempi Messaggi di Commit:_
```
Fix: NullPointerException bug in Network.js
```

```
Update: added getters and setters to Gateway.js
```

```
Refactor: moved sql.js from db/ to dao/
```

```
Refactor: renamed db/ into database/

Il nome precedente era ambiguo, poteva creare confusione con altri package
```


### Issue

_Creazione Issue:_
- `Title`: il titolo deve riassumere che problema (o implementazione di Item) sta dettagliando la Issue
- `Description`: descrivere cosa deve risolvere la Issue
- `Assignee`: siccome l'assegnazione della Issue a più persone è una feature Premium, assegnare a voi stessi, oppure a nessuno se ne occupano `2+` persone
- `Labels`: ho definito 4 possibili Label nel Repo. Il tab "Labels" si trova sotto il tab "Manage"

_Chiusura Issue:_<br>
In generale, la Issue dovrebbe essere chiusa in automatico dalla Merge Request relativa al momento della chiusura della MR se si è impostato correttamente il campo `Description` della MR. Spiegato meglio nella sezione della Merge Request.


### Merge Request

Il mapping Issue-MergeRequest è 1:1 <br>
Il mapping MergeRequest-Branch è 1:1 <br>
Il mapping MergeRequest-Commit è 1:n <br>

Dato che questo Repo è un Fork attivo di un altro Repo, GitLab non mostra, durante la creazione delle Issue, la possibilità di creare Branch e Merge Request associate alla Issue.
Per questo motivo, la Issue relativa va sempre indicata nel campo descrizione della Merge Request e il Branch associato va creato __prima__ della Merge Request stessa.

_Creazione Merge Request:_
- Selezionare come Branch Source il Branch appena creato (crearlo indipendentemente da GUI, Terminale o GitLab)
- Selezionare come Branch Target il Branch su cui si andrà a fare il Merge
- `Title`: lasciare quello default (sarà il nome del Branch capitalized)
- `Mark as draft`: il flag va rimosso (non stiamo facendo nulla di professionale e ci farebbe solo perdere tempo)
- `Description`: inserire al primo rigo la scritta con il formato: `Closes #<IssueID>`. Lasciare poi una blank line e se necessario scrivere la descrizione effettiva
- `Assignee`: siccome l'assegnazione della Issue a più persone è una feature Premium, assegnare a voi stessi, oppure a nessuno se ne occupano `2+` persone
- `Labels`: le Labels della Merge Request devono essere le stesse della Issue che sta risolvendo
- Il resto della compilazione è libero (probabilmente meglio lasciare valori default)

_Chiusura Merge Request:_<br>
Una volta eseguite e pushate tutte le Commit necessarie alla chiusura della Merge Request, eseguire la Merge Request tramite GitLab.
Lasciare i valori di default (compreso il messaggio). Assicuratevi che il flag che elimina il Branch Effimero sia attivo.