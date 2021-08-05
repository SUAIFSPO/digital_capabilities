package com.jerael.studentrecognition.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.jerael.studentrecognition.R
import com.jerael.studentrecognition.utils.login
import com.jerael.studentrecognition.utils.showToast
import kotlinx.android.synthetic.main.activity_auth.*

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