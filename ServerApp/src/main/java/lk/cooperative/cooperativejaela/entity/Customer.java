package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Customer {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    @Pattern(regexp = "^[A-Z][a-zA-Z-'\\s]{1,}$", message = "Invalid Name")
    private String name;
    @Basic
    @Column(name = "birthday")
    private Date birthday;
    @Basic
    @Column(name = "email")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Invalid Email Address")
    private String email;
    @Basic
    @Column(name = "phonenumber")
    @Pattern(regexp = "^0[0-9]{9}$", message = "Invalid Phone Number")
    private String phonenumber;
    @Basic
    @Column(name = "city")
    @Pattern(regexp = "^.*$", message = "Invalid City")
    private String city;
    @ManyToOne
    @JoinColumn(name = "gender_id", referencedColumnName = "id", nullable = false)
    private Gender gender;
    @ManyToOne
    @JoinColumn(name = "loyaltyprogram_id", referencedColumnName = "id", nullable = false)
    private Loyaltyprogram loyaltyprogram;
    @Basic
    @Column(name = "date")
    private Date date;
    @JsonIgnore
    @OneToMany(mappedBy = "customer")
    private Collection<Invoice> invoices;

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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Collection<Invoice> getInvoices() {
        return invoices;
    }

    public void setInvoices(Collection<Invoice> invoices) {
        this.invoices = invoices;
    }
}
