package lk.cooperative.cooperativejaela.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
public class Customer {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "birthday")
    private Date birthday;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "phonenumber")
    private String phonenumber;
    @Basic
    @Column(name = "city")
    private String city;
    @ManyToOne
    @JoinColumn(name = "gender_id", referencedColumnName = "id", nullable = false)
    private Gender gender;
    @ManyToOne
    @JoinColumn(name = "loyaltyprogram_id", referencedColumnName = "id", nullable = false)
    private Loyaltyprogram loyaltyprogram;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return id == customer.id && Objects.equals(name, customer.name) && Objects.equals(birthday, customer.birthday) && Objects.equals(email, customer.email) && Objects.equals(phonenumber, customer.phonenumber) && Objects.equals(city, customer.city);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, birthday, email, phonenumber, city);
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Loyaltyprogram getLoyaltyprogram() {
        return loyaltyprogram;
    }

    public void setLoyaltyprogram(Loyaltyprogram loyaltyprogram) {
        this.loyaltyprogram = loyaltyprogram;
    }
}
