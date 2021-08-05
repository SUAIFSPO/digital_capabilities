package com.jerael.universityscheduler.ui

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.jerael.universityscheduler.R
import com.jerael.universityscheduler.utils.login
import com.jerael.universityscheduler.utils.showToast
import kotlinx.android.synthetic.main.activity_auth.*
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*

class AuthActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auth)

        this.title = "Авторизация"

        button_login.setOnClickListener {

            val login: String = login.text.toString()
            val password: String = password.text.toString()

            if (checkFields(login, password)) {

                login(this, login, password) { isSuccess ->

                    if (isSuccess) {
                        startActivity(Intent(this, MainActivity::class.java))
                        finish()
                    }
                }
            }

        }

        button_password_recovery.setOnClickListener {
            startActivity(Intent(this, PasswordRecoveryActivity::class.java))
        }
    }

    private fun checkFields(login: String, password: String): Boolean {

        return if (login.contains(" ") || password.contains(" ")) {
            showToast("Пробелы в полях недопустимы")
            false
        } else if (login.isEmpty()) {
            showToast("Поле Логин не может быть пустым")
            false
        } else if (password.isEmpty()) {
            showToast("Поле Пароль не может быть пустым")
            false
        } else {
            true
        }
    }

}