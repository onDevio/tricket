FROM mongo
RUN apt-get update
RUN apt-get install -y python
RUN apt-get install -y curl
RUN curl -O https://bootstrap.pypa.io/get-pip.py
RUN python get-pip.py
RUN pip install awscli
RUN mkdir -p /backup
WORKDIR /backup
ADD backup.sh /backup/
ADD restore.sh /backup/
CMD ["/backup/backup.sh"]
