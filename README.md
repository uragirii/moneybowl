# Moneybowl

Master SQL while learning interesting facts about cricket.

### About the tech stack

**Frontend**: This repo contains the frontend which is written using Next.js.

**Database**: The dataset is stored in a SQLite database which is read into memory by the frontend client.
The data for the dataset comes from [cricsheet.org](https://cricsheet.org/) and is processed into a SQLite database
using the code in [to be linked]() repo. The SQLite database file is stored in a cloud bucket.

**Questions**: The questions are stored in a YAML file at `static/[databaseName]/questions.yaml`. Feel free to add
more questions using a pull request. The structure for the YAML can be found at [`types/index.ts#Questions`](types/index.ts)
