;; __NAME__ SIP-009 Non-Fungible Token Contract

(define-trait sip009-nft-trait
  (
    (get-last-token-id () (response uint uint))
    (get-token-uri (uint) (response (string-utf8 256) uint))
    (get-owner (uint) (response principal uint))
    (transfer (uint principal principal) (response bool uint))
  )
)

(define-constant ERR_UNAUTHORIZED u401)
(define-constant ERR_NOT_FOUND u404)

(define-data-var last-token-id uint u0)
(define-map token-owner ((id uint)) principal)
(define-map token-uri ((id uint)) (string-utf8 256))

(define-public (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-public (get-owner (id uint))
  (match (map-get token-owner ((id id)))
    owner (ok owner)
    (err ERR_NOT_FOUND)
  )
)

(define-public (get-token-uri (id uint))
  (match (map-get token-uri ((id id)))
    uri (ok uri)
    (err ERR_NOT_FOUND)
  )
)

(define-public (transfer (id uint sender principal recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_UNAUTHORIZED)
    (match (map-get token-owner ((id id)))
      current-owner
        (if (is-eq current-owner sender)
          (begin
            (map-set token-owner ((id id)) recipient)
            (ok true)
          )
          (err ERR_UNAUTHORIZED)
        )
      (err ERR_NOT_FOUND)
    )
  )
)

(define-read-only (get-symbol) "__SYMBOL__")

(define-read-only (get-name) "__NAME__")

(impl-trait .sip009-nft-trait)
