module.exports = {
  mailinMsg: {
    html: '<div><b>Hello world!</b></div>',
    text: 'Hello world!',
    headers: {
      from: 'John Doe <john.doe@somewhere.com>',
      to: 'Jane Doe <jane.doe@somewhereelse.com>',
      subject: 'New Ticket',
      'content-type': 'multipart/mixed; boundary="----mailcomposer-?=_1-1395066415427"',
      'mime-version': '1.0'
    },
    priority: 'normal',
    from: [{
      address: 'john.doe@somewhere.com',
      name: 'John Doe'
    }],
    to: [{
      address: 'jane.doe@somewhereelse.com',
      name: 'Jane Doe'
    }],
    attachments: [{
      contentType: 'text/plain',
      fileName: 'dummyFile.txt',
      contentDisposition: 'attachment',
      transferEncoding: 'base64',
      generatedFileName: 'dummyFile.txt',
      contentId: '6e4a9c577e603de61e554abab84f6297@mailparser',
      checksum: 'e9fa6319356c536b962650eda9399a44',
      length: '28'
    }],
    connection: {
      from: 'John Doe <john.doe@somewhere.com>',
      to: ['Jane Doe <jane.doe@somewhereelse.com>'],
      remoteAddress: '91.142.31.23',
      authentication: {
        username: false,
        authenticated: false,
        state: 'NORMAL'
      },
      id: '0e9b7099'
    },
    dkim: 'failed',
    spf: 'pass',
    spamScore: 3.3,
    language: 'english',
    cc: [{
      address: 'james@mail.com',
      name: 'James'
    }],
    envelopeFrom: {
      address: 'john.doe@somewhere.com',
      name: 'John Doe'
    },
    envelopeTo: [{
      address: 'jane.doe@somewhereelse.com',
      name: 'Jane Doe'
    }]
  },
  'dummyFile.txt': 'a-base64-encoded-string=='
};
