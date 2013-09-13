logserver
=========


goals: a database

- that can accept write streams of any key value data
- that uses a max amount of disk space but can refrence and query a dataset of ANY size via download of remote logs to local cache
- that backs up logs to a remote service (scheduled,shutdown,evented,compaction)
- that ensures log files are always less than max size in uncompressed bytes
- can merge log data from other servers. eventual consistency.
- new line delimited json human friendly log files as a default.
- log files names should be reasonably descriptive of key ranges that they contain.
- to create a log server that can provide a stream of data from any time range
- manages replication/merge with vector clocks or the like in such a way as it works.
- keeps a manifest log of all logs it knows about. local and remote.
- generates a bloom filter for every log to optimize single gets.
- compacted log rows contain {server id, server clock, log id, key, value} this data follows every log row
- should be able to ingest newline delimited json logs very quickly

on compaction the id hash of the source log must be persisted with the row.

this way on resume I can get streaming data sorted before my cursor in the data associated with new log ids but not data before the cursor in later logs.


writing data
------------
put key with value
a set of up to N append only sorted logs

a unsorted imediate append only log / memtable btree
all batches are written to the immediate log

all immediate logs at N entries are sorted as batches into sorted logs

when the sum in bytes of all data in all sorted logs reaches Max bytes compaction should be started


manifest
--------
server id
local manifest
remote manifest

compaction
----------

all writeable logs marked for compaction are flagged as unwriteable with the manifest
the mergesort stream is initiated for all logs flagged
at least one immutable log file is produced. a log file contains up to MAX log size + the remainder of an overlapping value.
any remaining values are written to a writeable sorted log and flagged as writeable with the manifest.
the immutable log is added to the manifest as immutable with key range
the immutable file should be backed up


backup
------
a core of everything this is about is backup. i cant worry about anything at all really. writes should always work and data should always get backed up.


replication
-----------

same as compaction. last write wins sorted by timstamp. i could implement better clocks but simply do not need better right now. deterministic by sorting the md5 sum of the conflicting key+value.
this is only one option and because they are logs all of the data is there. you should be able to stream through time as well




/// each log is

vector clocks for eventual consistency..
each time I upload a file 
1 download clocks
2 upload clock
3 upload file clock
4 upload file

each time I download a file I 
1 download file clock
2 download file

how do I compact in a log 
