# ConnectiNET-kraljevi
FER Programsko Inžinjerstvo ak. godina 2023./2024. Tim-3 Kraljevi


# Start instructions
Backend:
-------------
* `pip install -r requirements.txt`
* `flask --app app run` (`--debug` za live reload)

Frontend:
-------------
* `npm install`
* `npm start` (development server)
* `npm run build` (build za serving sa serverom)


# Git
Workflow:
-------------
* `git pull` (napraviti na devdoc ili develop - povlaci promjene i nove brancheve s remote-a)
* `git checkout -b ime_brancha` (ako je docs promjena ovo napraviti s devdoc-a, ako je development s developa - u svakom slucaju NAKON pull-anja - kreira novi branch i stavlja vas u njega)
* `git add .` (dodaje sve promjene u staging) -> `git commit -m 'commit message'` (nakon nekog konkretnog seta promjena napravite commit da naznacite napravljen korak prema zavrsetku zadatka)
* `git push` (gura lokalne promjene na remote)
* Kad ste gotovi s feature-om koji radite, odite u pull requests i napravite novi IZ vaseg brancha za feature U develop ili devdoc (ovisno jeste li radili docs ili development)
* Ostali pogledamo pull request i merge-a se kad svi odobrimo (ako je potrebno)


# LaTeX
Setup - Linux:
-------------
* `sudo apt-get install texlive-full` (skida sve potrebno, ali treba 6 GB pa pazite)
* `pdflatex PROGI_ProjektnaDokumentacija.tex` (runnati u direktoriju gdje se nalaze svi .tex file-ovi, tj. dokumentacija - kreira puno extra file-ova tako da najbolje napravite novi folder van git repozitorija u kojem ovo runnate pa ga update-ajte kad provjeravate kako pdf izgleda, ne radite ovo u nasem repozitoriju)
