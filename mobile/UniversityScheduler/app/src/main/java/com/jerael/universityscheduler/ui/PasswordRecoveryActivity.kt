package com.jerael.universityscheduler.ui

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import com.jerael.universityscheduler.*
import com.jerael.universityscheduler.utils.recoveryPassword
import com.jerael.universityscheduler.utils.showAlertDialog
import com.jerael.universityscheduler.utils.showToast
import kotlinx.android.synthetic.main.activity_password_recovery.*

class PasswordRecoveryActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_password_recovery)

        this.title = "Восстановление пароля"

        this.actionBar?.setDisplayHomeAsUpEnabled(true)

        button_recovery.setOnClickListener {

            val login = recovery_login.text.toString()
            val fio = recovery_fio.text.toString()

            if (checkFields(login, fio)) {
                recoveryPassword(this, login, fio) { password ->
                    if (password != null) {

                        val title = "Ваш пароль"

                        showAlertDialog(this, password, title)
                    }
                }
            }
        }
    }

    private fun checkFields(login: String, fio: String): Boolean {

        return if (login.contains(" ") || fio.contains(" ")) {
            showToast("Пробелы в полях недопустимы")
            false
        } else if (login.isEmpty()) {
            showToast("Поле Логин не может быть пустым")
            false
        } else if (fio.isEmpty()) {
            showToast("Поле ФИО не может быть пустым")
            false
        } else {
            true
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {

        when (item.itemId) {
            android.R.id.home -> {
                startActivity(Intent(this, AuthActivity::class.java))
                finish()
            }
        }

        return super.onOptionsItemSelected(item)
    }
}