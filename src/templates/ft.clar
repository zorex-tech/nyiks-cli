(impl-trait 'SP3FBR2AGK80GMGA9DSZZ8VB2W4Y3WQB0ZXQ0D4T5.token-trait.token-trait)

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))
(define-constant ERR_ZERO_AMOUNT (err u102))

(define-data-var total-supply uint u0)
(define-data-var balances (map principal uint))
(define-data-var owner principal tx-sender)

(define-constant token-name "__NAME__")
(define-constant token-symbol "__SYMBOL__")
(define-constant token-decimals u6)
(define-constant token-max-supply u__MAX_SUPPLY__)

(define-public (get-name) (ok token-name))
(define-public (get-symbol) (ok token-symbol))
(define-public (get-decimals) (ok token-decimals))
(define-public (get-total-supply) (ok (var-get total-supply)))

(define-read-only (get-balance (account principal))
  (ok (default-to u0 (map-get? balances account)))
)

(define-public (transfer (recipient principal) (amount uint))
  (begin
    (if (is-eq amount u0)
        (err ERR_ZERO_AMOUNT)
        (let (
          (sender tx-sender)
          (sender-balance (default-to u0 (map-get? balances sender)))
        )
          (if (< sender-balance amount)
              ERR_INSUFFICIENT_BALANCE
              (begin
                (map-set balances sender (- sender-balance amount))
                (map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))
                (ok true)
              )
          )
        )
    )
  )
)

(define-public (mint (recipient principal) (amount uint))
  (begin
    (if (not (is-eq tx-sender (var-get owner)))
        ERR_UNAUTHORIZED
        (let (
          (new-supply (+ (var-get total-supply) amount))
        )
          (if (> new-supply token-max-supply)
              (err u103)
              (begin
                (var-set total-supply new-supply)
                (map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))
                (ok true)
              )
          )
        )
    )
  )
)

(define-public (burn (amount uint))
  (let (
    (sender tx-sender)
    (balance (default-to u0 (map-get? balances sender)))
  )
    (if (< balance amount)
        ERR_INSUFFICIENT_BALANCE
        (begin
          (map-set balances sender (- balance amount))
          (var-set total-supply (- (var-get total-supply) amount))
          (ok true)
        )
    )
  )
)
