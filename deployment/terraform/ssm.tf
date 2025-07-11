resource "aws_ssm_document" "session_manager_prefs" {
  name            = "${local.stack}-civet-ssm"
  document_type   = "Session"
  document_format = "JSON"

  content = <<DOC
{
  "schemaVersion": "1.0",
  "description": "Document to hold regional settings for Session Manager",
  "sessionType": "Standard_Stream",
  "inputs": {
    "idleSessionTimeout": "20",
    "runAsEnabled": false,
    "shellProfile": {
      "linux": "sudo -s; su ubuntu; exec /bin/bash; cd /srv/civet"
    }
  }
}
DOC
}