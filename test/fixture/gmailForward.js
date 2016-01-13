'use strict';

module.exports = {
  "html": "<div dir=\"ltr\">Esto es una prueba.</div>\n",
  "text": "Esto es una prueba.\n",
  "headers": {
    "received": [
      "by mail-yk0-f172.google.com with SMTP id x184so104060639yka.3 for <ondevio@tricket.ondevio.com>; Sat, 19 Dec 2015 23:55:17 -0800 (PST)",
      "by 10.37.116.18 with SMTP id p18csp776972ybc; Sat, 19 Dec 2015 23:55:15 -0800 (PST)",
      "from mail-wm0-x22a.google.com (mail-wm0-x22a.google.com. [2a00:1450:400c:c09::22a]) by mx.google.com with ESMTPS id gf10si39997280wjb.142.2015.12.19.23.55.15 for <soporte@ondevio.com> (version=TLS1_2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128); Sat, 19 Dec 2015 23:55:15 -0800 (PST)",
      "by mail-wm0-x22a.google.com with SMTP id p187so33794892wmp.0 for <soporte@ondevio.com>; Sat, 19 Dec 2015 23:55:15 -0800 (PST)",
      "from mail-wm0-f53.google.com (mail-wm0-f53.google.com. [74.125.82.53]) by smtp.gmail.com with ESMTPSA id e9sm22361802wjp.18.2015.12.19.23.55.14 for <soporte@ondevio.com> (version=TLS1_2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128); Sat, 19 Dec 2015 23:55:14 -0800 (PST)",
      "by mail-wm0-f53.google.com with SMTP id l126so33777621wml.0 for <soporte@ondevio.com>; Sat, 19 Dec 2015 23:55:14 -0800 (PST)",
      "by 10.27.4.133 with HTTP; Sat, 19 Dec 2015 23:55:14 -0800 (PST)"
    ],
    "x-google-dkim-signature": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20130820; h=x-gm-message-state:delivered-to:dkim-signature:mime-version:date :message-id:subject:from:to:content-type; bh=TJNC/R8syCplyOIzqoI1gDK0gMJiZS5UxU8h0xQBzKU=; b=c3yN/jeYxPKDH1VGD1k0DqTt1TIbBRustmvUnCDjSkIXvbyDB6VfkJZ6YqLO08dsuG dAImlKgKY8uQzVtp7auoEPo7qj6oQ+rIq8Oh+gBGR8UWG7YqlwV62h44ZXrYXKdxo+Qg C40FvBaYGYx6OOZfKus8ZBtl+KUcPgZ6P0Ecj0CgYXsKRSRHK6wD9sg+0Y76NlPJPl4L KxjdUdU4FFfZfoYzu8AjRDU19U+pyjwH+NrYJMTEcTknTCq/GCefqe0SxrrLmOIdd2EA XvwpWP/lgJNH03KZLJ3gFI/9qcsxGDhSk2hUBVkCZ8q6M4xTr3IM4A98De/2Lapwg/fK HrPA==",
    "x-gm-message-state": "ALoCoQmW4geATX8MKEtaW1Y9mTYN9OT5r5Mvow1nBjiNxs1BWWdr5Pd6SJqfNSyWa+SqTX9QHASwCHOWyRoV+QKznBKVDzV6MCwbeglfyzwMpWjVAeZSY5U=",
    "x-received": [
      "by 10.129.90.69 with SMTP id o66mr10339561ywb.216.1450598116545; Sat, 19 Dec 2015 23:55:16 -0800 (PST)",
      "by 10.28.127.200 with SMTP id a191mr13853797wmd.27.1450598115868; Sat, 19 Dec 2015 23:55:15 -0800 (PST)",
      "by 10.194.117.68 with SMTP id kc4mr13393097wjb.77.1450598115381; Sat, 19 Dec 2015 23:55:15 -0800 (PST)",
      "by 10.194.115.67 with SMTP id jm3mr13538438wjb.9.1450598114640; Sat, 19 Dec 2015 23:55:14 -0800 (PST)"
    ],
    "x-forwarded-to": "ondevio@tricket.ondevio.com",
    "x-forwarded-for": "soporte@ondevio.com ondevio@tricket.ondevio.com",
    "delivered-to": "soporte@ondevio.com",
    "return-path": [
      "<mefernandez@ondevio.com>",
      "<mefernandez@ondevio.com>"
    ],
    "received-spf": "pass (google.com: domain of mefernandez@ondevio.com designates 2a00:1450:400c:c09::22a as permitted sender) client-ip=2a00:1450:400c:c09::22a;",
    "authentication-results": "mx.google.com; spf=pass (google.com: domain of mefernandez@ondevio.com designates 2a00:1450:400c:c09::22a as permitted sender) smtp.mailfrom=mefernandez@ondevio.com; dkim=pass header.i=@ondevio-com.20150623.gappssmtp.com",
    "dkim-signature": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=ondevio-com.20150623.gappssmtp.com; s=20150623; h=mime-version:date:message-id:subject:from:to:content-type; bh=TJNC/R8syCplyOIzqoI1gDK0gMJiZS5UxU8h0xQBzKU=; b=Nl2tQYlcjniWGEp5PQauUqjo5sK9T5V+Agp2sTm8MAC9enLHhIIGUlYUgdGv8EztHg 4e7XbT9GZKBmnnJnUHtY24Zq0Ja3GiXeyCmbxF3BtXBDYfeXA5Cl/ErLo196HaBqlnN0 cSK024B/vEOZmdo1K0MK5tjCd2L7rRIeesEYKnCrZ7ahw6VoZWbZ2eueZnHqRLxAkkUP NxH8h/bC1SvoOctMt1lWXxsrURDDx5gX7b/pRfO2mLilGcEYtW8I6Kmk2U1YKC2t1ZOm 4zDl6+a8o7xGPvqXrpSOOxDfbTmOzMqeLbzqxF+h0FNF/1V1/a0pMRHDzOmuUrehV24i gRNw==",
    "mime-version": "1.0",
    "date": "Sun, 20 Dec 2015 08:55:14 +0100",
    "x-gmail-original-message-id": "<CALTA3KTPtx_OuspWdB=QB=6gaVFk2t69uH1fRZrsq-Y2oJeCUg@mail.gmail.com>",
    "message-id": "<CALTA3KTPtx_OuspWdB=QB=6gaVFk2t69uH1fRZrsq-Y2oJeCUg@mail.gmail.com>",
    "subject": "Prueba",
    "from": "Mariano Eloy Fernández Osca <mefernandez@ondevio.com>",
    "to": "soporte@ondevio.com",
    "content-type": "multipart/alternative; boundary=001a1130cd9855ccd605274fb150"
  },
  "subject": "Prueba",
  "messageId": "CALTA3KTPtx_OuspWdB=QB=6gaVFk2t69uH1fRZrsq-Y2oJeCUg@mail.gmail.com",
  "priority": "normal",
  "from": [
    {
      "address": "mefernandez@ondevio.com",
      "name": "Mariano Eloy Fernández Osca"
    }
  ],
  "to": [
    {
      "address": "soporte@ondevio.com",
      "name": ""
    }
  ],
  "date": "2015-12-20T07:55:14.000Z",
  "receivedDate": "2015-12-20T07:55:17.000Z",
  "dkim": "failed",
  "spf": "failed",
  "spamScore": 0,
  "language": "spanish",
  "cc": [],
  "attachments": [],
  "connection": {
    "id": "855bbfd6-db30-435b-9226-541e86155478",
    "remoteAddress": "::ffff:209.85.160.172",
    "clientHostname": "[::ffff:209.85.160.172]",
    "hostNameAppearsAs": "mail-yk0-f172.google.com",
    "envelope": {
      "mailFrom": {
        "address": "soporte+caf_=ondevio=tricket.ondevio.com@ondevio.com",
        "args": false
      },
      "rcptTo": [
        {
          "address": "ondevio@tricket.ondevio.com",
          "args": false
        }
      ]
    },
    "user": false,
    "transaction": 1,
    "mailPath": ".tmp/855bbfd6-db30-435b-9226-541e86155478"
  },
  "envelopeFrom": {
    "address": "soporte+caf_=ondevio=tricket.ondevio.com@ondevio.com",
    "args": false
  },
  "envelopeTo": [
    {
      "address": "ondevio@tricket.ondevio.com",
      "args": false
    }
  ]
}
