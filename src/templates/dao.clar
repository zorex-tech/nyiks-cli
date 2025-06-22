(define-constant DAO-NAME "__NAME__")
(define-constant DAO-SYMBOL "__SYMBOL__")
(define-constant MAX-SUPPLY u__MAX_SUPPLY__)
(define-constant PROPOSAL-LIFESPAN u144) ;; ~1 day at 10min/block

(define-data-var proposals 
  (list 100 
    (tuple 
      (id uint) 
      (description (string-ascii 256)) 
      (votes uint) 
      (submitted-at uint) 
      (executed bool)
    )
  ) 
  (list)
)

(define-data-var proposal-counter uint u0)
(define-data-var members (map principal bool))
(define-data-var votes (map (tuple (proposal-id uint) (voter principal)) bool))

;; Error constants
(define-constant ERR-NOT-MEMBER (err u100))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u101))
(define-constant ERR-ALREADY-VOTED (err u102))
(define-constant ERR-PROPOSAL-EXPIRED (err u103))
(define-constant ERR-PROPOSAL-EXECUTED (err u104))
(define-constant ERR-NOT-OWNER (err u403))
(define-constant ERR-NOT-ENOUGH-VOTES (err u401))

;; DAO membership management
(define-public (add-member (new-member principal))
  (begin
    (asserts! (is-eq tx-sender (contract-owner)) ERR-NOT-OWNER)
    (map-set members new-member true)
    (ok true)
  )
)

(define-public (remove-member (member principal))
  (begin
    (asserts! (is-eq tx-sender (contract-owner)) ERR-NOT-OWNER)
    (map-delete members member)
    (ok true)
  )
)

(define-read-only (is-member (who principal))
  (ok (default-to false (map-get? members who)))
)

;; Create new proposal
(define-public (propose (description (string-ascii 256)))
  (begin
    (asserts! (default-to false (map-get? members tx-sender)) ERR-NOT-MEMBER)
    (let ((id (var-get proposal-counter)))
      (var-set proposals 
        (append 
          (var-get proposals) 
          (list 
            (tuple 
              (id id) 
              (description description) 
              (votes u0) 
              (submitted-at block-height) 
              (executed false)
            )
          )
        )
      )
      (var-set proposal-counter (+ id u1))
      (ok id)
    )
  )
)

;; Vote on proposal
(define-public (vote (proposal-id uint))
  (begin
    (asserts! (default-to false (map-get? members tx-sender)) ERR-NOT-MEMBER)

    (let (
      (current-proposals (var-get proposals))
      (index (fold 
        (lambda (i proposal acc)
          (if (is-eq (get id proposal) proposal-id) i acc))
        u0 current-proposals u100))
    )
      (if (is-eq index u100)
        ERR-PROPOSAL-NOT-FOUND
        (let ((proposal (element-at? current-proposals index)))
          (match proposal p
            (begin
              (asserts! (not (get executed p)) ERR-PROPOSAL-EXECUTED)
              (asserts! (<= block-height (+ (get submitted-at p) PROPOSAL-LIFESPAN)) ERR-PROPOSAL-EXPIRED)

              (let ((vote-key (tuple (proposal-id proposal-id) (voter tx-sender))))
                (asserts! (is-none (map-get? votes vote-key)) ERR-ALREADY-VOTED)

                (let ((updated (tuple
                                (id (get id p))
                                (description (get description p))
                                (votes (+ (get votes p) u1))
                                (submitted-at (get submitted-at p))
                                (executed false))))
                  (var-set proposals (replace-at current-proposals index updated))
                  (map-set votes vote-key true)
                  (ok true)
                )
              )
            )
            (err u500)
          )
        )
      )
    )
  )
)

;; Execute a proposal (if enough votes)
(define-public (execute (proposal-id uint))
  (let (
    (current-proposals (var-get proposals))
    (index (fold 
      (lambda (i proposal acc)
        (if (is-eq (get id proposal) proposal-id) i acc))
      u0 current-proposals u100))
  )
    (if (is-eq index u100)
      ERR-PROPOSAL-NOT-FOUND
      (let ((proposal (element-at? current-proposals index)))
        (match proposal p
          (begin
            (asserts! (not (get executed p)) ERR-PROPOSAL-EXECUTED)
            (asserts! (<= block-height (+ (get submitted-at p) PROPOSAL-LIFESPAN)) ERR-PROPOSAL-EXPIRED)

            ;; Require at least 3 votes to execute (custom logic)
            (if (< (get votes p) u3)
              ERR-NOT-ENOUGH-VOTES
              (let ((executed (tuple
                                (id (get id p))
                                (description (get description p))
                                (votes (get votes p))
                                (submitted-at (get submitted-at p))
                                (executed true))))
                (var-set proposals (replace-at current-proposals index executed))

                ;; TODO: Place actual execution logic here (e.g. call another contract)
                (ok (tuple (executed true)))
              )
            )
          )
          (err u500)
        )
      )
    )
  )
)

(define-read-only (get-proposals)
  (ok (var-get proposals))
)
