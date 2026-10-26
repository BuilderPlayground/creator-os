const { ObjectId } = require('mongodb')

module.exports = function(app, passport, db) {

    // Helpers
    const stages = [
        'Inquiry',
        'Negotiating',
        'Contracted',
        'In Progress',
        'Completed'
    ]

    const paymentStatuses = [
        'Not Invoiced',
        'Invoice Sent',
        'Pending',
        'Paid',
        'Overdue'
    ]

    function cleanText(value, maxLength = 150) {
        return typeof value === 'string'
            ? value.trim().slice(0, maxLength)
            : ''
    }

    function dealFields(body) {
        const rawAmount = Number(body.amount)

        return {
            brand: cleanText(body.brand),
            campaign: cleanText(body.campaign),
            platform: cleanText(body.platform),
            amount: Number.isFinite(rawAmount) && rawAmount >= 0
                ? rawAmount
                : 0,
            stage: stages.includes(body.stage)
                ? body.stage
                : 'Inquiry',
            paymentStatus: paymentStatuses.includes(body.paymentStatus)
                ? body.paymentStatus
                : 'Not Invoiced',
            dueDate: /^\d{4}-\d{2}-\d{2}$/.test(body.dueDate || '')
                ? body.dueDate
                : '',
            notes: cleanText(body.notes, 2000),
            updatedAt: new Date()
        }
    }

    // HOME
    app.get('/', function(req, res) {
        res.render('index.ejs')
    })

    // CREATOR DASHBOARD
    app.get('/profile', isLoggedIn, async function(req, res) {
        try {
            const deals = await db.collection('deals')
                .find({ ownerId: String(req.user._id) })
                .sort({ createdAt: -1 })
                .toArray()

            res.render('profile.ejs', {
                user: req.user,
                deals: deals,
                messages: [] // Temporary compatibility with old profile page
            })
        } catch (error) {
            console.error('Dashboard error:', error)
            res.status(500).send('Unable to load dashboard.')
        }
    })

    // CREATES A DEAL
    app.post('/deals', isLoggedIn, async function(req, res) {
        try {
            const deal = dealFields(req.body)

            if (!deal.brand) {
                return res.status(400).send('Brand name is required.')
            }

            await db.collection('deals').insertOne({
                ...deal,
                ownerId: String(req.user._id),
                createdAt: new Date()
            })

            res.redirect('/profile')
        } catch (error) {
            console.error('Create deal error:', error)
            res.status(500).send('Unable to create deal.')
        }
    })

    // UPDATES A DEAL
    app.post('/deals/:id/update', isLoggedIn, async function(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                return res.status(400).send('Invalid deal ID.')
            }

            const deal = dealFields(req.body)

            if (!deal.brand) {
                return res.status(400).send('Brand name is required.')
            }

            const result = await db.collection('deals').updateOne(
                {
                    _id: new ObjectId(req.params.id),
                    ownerId: String(req.user._id)
                },
                {
                    $set: deal
                }
            )

            if (!result.matchedCount) {
                return res.status(404).send('Deal not found.')
            }

            res.redirect('/profile')
        } catch (error) {
            console.error('Update deal error:', error)
            res.status(500).send('Unable to update deal.')
        }
    })

    // DELETES A DEAL
    app.post('/deals/:id/delete', isLoggedIn, async function(req, res) {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                return res.status(400).send('Invalid deal ID.')
            }

            const result = await db.collection('deals').deleteOne({
                _id: new ObjectId(req.params.id),
                ownerId: String(req.user._id)
            })

            if (!result.deletedCount) {
                return res.status(404).send('Deal not found.')
            }

            res.redirect('/profile')
        } catch (error) {
            console.error('Delete deal error:', error)
            res.status(500).send('Unable to delete deal.')
        }
    })

    // LOGOUT
    // Original Savage Auth logout route retained
    app.get('/logout', function(req, res) {
        req.logout(() => {
            console.log('User has logged out!')
        });
        res.redirect('/');
    });

    // LOGIN
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        })
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))

    // SIGNUP
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        })
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    // UNLINK LOCAL ACCOUNT
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        const user = req.user

        user.local.email = undefined
        user.local.password = undefined

        user.save(function(err) {
            if (err) {
                console.error('Unlink error:', err)
                return res.status(500).send('Unable to unlink account.')
            }

            res.redirect('/profile')
        })
    })

}

// Authentication middleware (i.e., the software component that sits between a user (or client) and an application's core logic to verify identity before granting access to a resource)
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}