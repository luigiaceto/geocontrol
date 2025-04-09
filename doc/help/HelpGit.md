# Comandi Git Utili

Un consiglio generale (se avete Windows) è di impostare la Git Bash come terminale di default in VS Code piuttosto che cmd o powershell.

## Comandi da Eseguire ogni volta che iniziate a lavorare:

```
git fetch --all
git pull --all
```
Comodità in Bash:
```
git fetch --all && git pull --all
```

Il comando `git fetch --all` scarica tutte le informazioni remote (ma non i Branch stessi).

Il comando `git pull --all` rende up-to-date tutti i Branch locali che hanno corrispettivo remoto.

## Muoversi tra Branch esistenti:

I seguenti comandi possono anche essere utilizzati su Branch remoti che ancora non esistevano in locale. 

```
git checkout <nome-branch>
```

Oppure

```
git switch <nome-branch>
```

## Creazione Nuovi Branch:

Preferibile rispetto a fare una Commit direttamente sul Branch principale corrente.

```
git checkout -b <nome-nuovo-branch>
```

Oppure

```
git switch -c <nome-nuovo-branch>
```

## Eliminare Branch Locali che non esistono più in Remoto:

1) Muoversi su un Branch non effimero
2) Eseguire il comando qui sotto

Funziona solo su shell Bash.

```
git branch --v | grep "\[gone\]" | awk '{print $1}' | xargs git branch -D
```

## Cosa fare dopo aver completato una Merge Request:

1) Muoversi su un Branch che esiste in Remoto
2) Eliminare i Branch Locali che non esistono più in Remoto: o usando il comando sopra o a mano

## Revert di una Commit (ultima):

Nel caso si faccia una Commit errata, con questo comando si può tornare inditro __alla ultima__ commit (ovvero la commit precedente all'errore).
Questo non elimina le modifiche lato editor. In pratica elimina solo la commit ma non le modifche locali fatte nell'editor.
```
git reset --soft HEAD~1
```
Dopo aver usato questo comando, per fare push è necessario usare il tag `--force`:
```
git push --force
```

## Rebase di un Branch:

Usare solo se sai quello che stai facendo e perché.
```
git rebase <branch-princiaple> <branch-su-cui-fare-rebase>
```
Le probabilità di conflitti sono alte dopo un rebase.
