# Group Text Free

# Install & Run Demo

```bash
git clone git@github.com:coolaj86/grouptextfree.git
pushd grouptextfree

npm install
jade server/public/index.jade
node server 3010
```

## API

### POST /sms

curl http://tel-carrier.coolaj86.com:3010/sms \
  -X 'POST' \
  -H 'Content-Type: application/json' \
  -d '{ "numbers": [ 8013605555 ]
      , "service": "Zoho"
      , "email": "me@my.biz"
      , "password": "secret"
      , "sms": "[TEST MSG] Hello World! [/TEST]"
      }'

### GET /lookup?numbers=8013605555,8012705555

Get info about said numbers.

```bash
curl http://grouptextfree.coolaj86.com/lookup?numbers=8013605555
```

```json
[
  {
    "number": "+18013605555",
    "wireless": true,
    "carrier": "verizon",
    "smsGateway": "8013605555@vtext.com",
    "mmsGateway": "8013605555@vzwpix.com",
    "carrierComment": "Verizon",
    "typeComment": "WIRELESS PROV"
  }
]
```

### GET /gateways

A full list of all gateways in the system

```bash
curl http://grouptextfree.coolaj86.com/gateways
```

```json
{ "verizon":
  { "sms": "vtext.com"
  , "mms": "vpix.com"
  }
}
```

### POST /analytics

Update the carriers list

```bash
curl http://grouptextfree.coolaj86.com/analytics \
  -X POST
  -H 'Content-Type: application/json' \
  -d '{ "gateways":
          { "verizon":
            { "sms": "vtext.com"
            , "mms": "vpix.com"
            }
          }
      , "numbers": {
          "+18013605555":
          { "carrier": "verizon"
          , "wireless": true
          }
        }
      }'
```

# Why Not Just Email All the Gateways?

Since it's free to email the numbers, why not just email all 10 major gateways
for each number and not worry about it being correct?

Because it's like saying

> Hey, guys I figured out a brand new way to get a server on all the blacklists!
> All we have to do is send messages that have a guaranteed 90% bounce rate!

It'll likely get you blocked A) by the carriers and B) by the SMTP servers and C) on senderbase.com

Note on reliability of email to text gateways: <http://stackoverflow.com/questions/1179854/limitations-on-sms-messages-sent-using-free-email-sms-gateways>
